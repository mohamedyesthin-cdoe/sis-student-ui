import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException, status
from src.core.config import settings
import uuid
import requests
from urllib.parse import urlparse
import ast

class DocumentService:
    def __init__(self):
        """Initialize AWS S3 client"""
        self.bucket = settings.AWS_S3_BUCKET
        self.region = settings.AWS_REGION
        self.folder = settings.AWS_S3_FOLDER
        self.base_folder = "student-documents"

        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

    async def upload_to_s3(self, file: UploadFile) -> str:
        """Upload file to AWS S3 and return public URL"""
        try:
            s3_key = f"{self.folder}/{file.filename}"

            self.s3_client.upload_fileobj(
                file.file,
                self.bucket,
                s3_key,
                ExtraArgs={"ContentType": file.content_type}
            )

            file_url = f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{s3_key}"
            return file_url

        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(e)}")

    def delete_from_s3(self, file_url: str):
        """Delete file from AWS S3"""
        try:
            if "amazonaws.com/" not in file_url:
                raise HTTPException(status_code=400, detail="Invalid S3 URL")

            s3_key = file_url.split(f"amazonaws.com/")[-1]
            self.s3_client.delete_object(Bucket=self.bucket, Key=s3_key)

        except ClientError as e:
            raise HTTPException(status_code=500, detail=f"S3 delete failed: {str(e)}")
        
    def upload_external_file(
        self,
        file_url,
        program_id: int,
        register_number: str,
        document_type: str
    ):
        """
        Download file(s) from ERP URL and upload to S3.
        Returns list of uploaded S3 URLs.
        """

        try:
            if not file_url:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "File URL is not found",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )

            # --------------------------------------------------
            # ✅ STEP 1: Normalize input to list
            # --------------------------------------------------

            if isinstance(file_url, str):
                try:
                    # if stringified list → convert to list
                    parsed = ast.literal_eval(file_url)
                    if isinstance(parsed, list):
                        file_url = parsed
                    else:
                        file_url = [file_url]
                except:
                    file_url = [file_url]

            if not isinstance(file_url, list):
                file_url = [file_url]

            uploaded_urls = []

            # --------------------------------------------------
            # ✅ STEP 2: Process each file
            # --------------------------------------------------

            for url in file_url:

                # Skip if already S3 URL
                if self.bucket in url:
                    uploaded_urls.append(url)
                    continue

                try:
                    response = requests.get(url, timeout=15)
                    response.raise_for_status()
                except requests.RequestException as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail={
                            "message": f"Failed to download file from ERP: {str(e)}",
                            "code": status.HTTP_400_BAD_REQUEST,
                            "status": False
                        }
                    )

                # Extract extension
                parsed_url = urlparse(url)
                extension = parsed_url.path.split('.')[-1]

                unique_filename = f"{document_type}_{uuid.uuid4()}.{extension}"

                s3_key = f"{self.base_folder}/{program_id}/{register_number}/{unique_filename}"

                # --------------------------------------------------
                # ✅ STEP 3: Upload to S3
                # --------------------------------------------------

                try:
                    self.s3_client.put_object(
                        Bucket=self.bucket,
                        Key=s3_key,  # 🔥 FIXED (was key before)
                        Body=response.content,
                        ContentType=response.headers.get("Content-Type")
                    )
                except ClientError as e:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail={
                            "message": f"S3 upload failed: {str(e)}",
                            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                            "status": False
                        }
                    )

                s3_url = f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{s3_key}"
                uploaded_urls.append(s3_url)

            return uploaded_urls

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Unexpected error: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )