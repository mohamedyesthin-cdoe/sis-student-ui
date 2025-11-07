import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException
from src.core.config import settings
import uuid

class DocumentService:
    def __init__(self):
        """Initialize AWS S3 client"""
        self.bucket = settings.AWS_S3_BUCKET
        self.region = settings.AWS_REGION
        self.folder = settings.AWS_S3_FOLDER

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
