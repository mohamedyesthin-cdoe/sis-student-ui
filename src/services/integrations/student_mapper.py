# src/mappers/student_mapper.py
from datetime import datetime
from typing import Dict, Any
import re

def get_first_id(field):
    """Safely return 'id' from first element of a list of dicts."""
    if isinstance(field, list) and len(field) > 0 and isinstance(field[0], dict): 
        return field[0].get("id")
    return None

def get_first_country(field):
    """Safely return 'id' from first element of a list of dicts."""
    if isinstance(field, list) and len(field) > 0 and isinstance(field[0], dict):
        if field[0].get("id"):
            return '101'
    return None

def get_first_item(field):
    """Safely return first element from a list."""
    if isinstance(field, list) and len(field) > 0:
        return field[0]
    return None

def get_title(field):
    """Safely return 'title' from first element of a list of dicts."""
    if isinstance(field, list) and len(field) > 0 and isinstance(field[0], dict):
        return field[0].get("title")
    return None

def timestamp_to_date(ts):
    return datetime.fromtimestamp(ts).date() if ts else None

def parse_date(value):
    if not value:
        return None
    
    # Case 1: Already a timestamp (int or float)
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value).date()
    
    # Case 2: Date string
    if isinstance(value, str):
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
            try:
                return datetime.strptime(value.strip(), fmt).date()
            except ValueError:
                continue
    
    return None

def ensure_datetime(value):
    if isinstance(value, datetime):
        return value
    if hasattr(value, "year") and hasattr(value, "month") and hasattr(value, "day"):
        # convert date → datetime at midnight
        return datetime(value.year, value.month, value.day)
    return value

def safe_float(value):
    try:
        if value is None or str(value).strip() == "":
            return 0.0
        return float(value)
    except (TypeError, ValueError):
        return 0.0

def map_api_to_student_schema(api_response: dict) -> Dict[str, Any]:
    mapped_data = {
        "program_id": int(get_first_id(api_response.get("campus")) or 0),
        "application_no": api_response.get("application_no"),
        "registration_no": "",
        "title": get_title(api_response.get("applicant_title")),
        "first_name": api_response.get("first_name", ""),
        "last_name": api_response.get("last_name", ""),
        "gender": get_title(api_response.get("gender")),
        "date_of_birth": timestamp_to_date(api_response.get("date_of_birth")),
        "blood_group": get_title(api_response.get("blood_group")),
        "email": api_response.get("email", ""),
        "mobile_number": re.sub(r'\D', '', api_response.get("mobile_no", "")),
        "alternative_phone": api_response.get("field_73372") or None,
        "whatsapp_number": api_response.get("field_73702", ""),
        "marital_status": get_title(api_response.get("marital_status")),
        "religion": get_title(api_response.get("religion")),
        "nationality": get_title(api_response.get("nationality")),
        "category": get_title(api_response.get("category")),
        "caste": api_response.get("field_73695") or None,
        "aadhaar_number": api_response.get("aadhar_card_no") or None,
        #"pan_number": api_response.get("field_73442") or None,
        "parent_guardian_name": api_response.get("field_73703", ""),
        "relationship_with_student": get_title(api_response.get("field_73698")),
        "current_employment": get_title(api_response.get("field_73700")),
        "annual_income": get_title(api_response.get("field_73440")),
        "locality": get_title(api_response.get("field_77021")),
        "passport_number": api_response.get("passport_number") or None,
        "passport_expiry_date": timestamp_to_date(api_response.get("field_73399")),
        "passport_issued_country": get_title(api_response.get("passport_issue_place")),
        "is_deleted": False,

        "address_details": {
            "corr_addr1": api_response.get("correspondence_address1", ""),
            "corr_addr2": api_response.get("correspondence_address2") or None,
            "corr_city": get_title(api_response.get("correspondence_city")),
            "corr_district": get_title(api_response.get("correspondence_district")),
            "corr_state": get_title(api_response.get("correspondence_state")),
            "corr_country": get_title(api_response.get("correspondence_country")),
            "corr_pin": api_response.get("correspondence_pincode", ""),
            "corr_addr_same": api_response.get("permanent_same_as_correspondence") == "Yes",
            "perm_addr1": api_response.get("permanent_address1") or None,
            "perm_addr2": api_response.get("permanent_address2") or None,
            "perm_city": get_title(api_response.get("permanent_city")),
            "perm_district": get_title(api_response.get("permanent_district")),
            "perm_state": get_title(api_response.get("permanent_state")),
            "perm_country": get_title(api_response.get("permanent_country")),
            "perm_pin": api_response.get("permanent_pincode") or None
        },

        "academic_details": {
            "ssc_school": api_response.get("field_73376_1_1", ""),
            "ssc_board_id": get_first_id(api_response.get("field_73376_1_2")),
            "ssc_scheme": api_response.get("field_73376_1_4", ""),
            "ssc_score": api_response.get("field_73376_1_5", ""),
            "ssc_year": timestamp_to_date(api_response.get("field_73376_1_3")),
            "after_ssc": api_response.get("field_73422", ""),
            "hsc_school": api_response.get("field_73378_1_1", ""),
            "hsc_board_id": get_first_id(api_response.get("field_73378_1_2")),
            "hsc_result": api_response.get("field_73378_1_4", ""),
            "hsc_scheme": api_response.get("field_73378_1_5", ""),
            "hsc_score": api_response.get("field_73378_1_6", ""),
            "hsc_year": timestamp_to_date(api_response.get("field_73378_1_3")),
            "diploma_institute": api_response.get("field_73426_1_1") or "",
            "diploma_board": api_response.get("field_73426_1_2") or "",
            "diploma_result": api_response.get("field_73426_1_4") or "",
            "diploma_scheme": api_response.get("field_73426_1_5") or "",
            "diploma_score": api_response.get("field_73426_1_6") or "",
            "diploma_year": timestamp_to_date(api_response.get("field_73426_1_3"))
        },

        "document_details": {
            "class_10th_marksheet": get_first_item(api_response.get("upload_10_marksheet")),
            "class_12th_marksheet": get_first_item(api_response.get("upload_12_marksheet")),
            "graduation_marksheet": api_response.get("upload_ug_marksheet") or None,
            "diploma_marksheet": api_response.get("upload_diplomamarkscard") or None,
            "work_experience_certificates": api_response.get("field_73434") or None,
            "passport": api_response.get("upload_passport") or None,
            "aadhar": get_first_item(api_response.get("color_copy_of_aadhar_card")),
            "signature": get_first_item(api_response.get("signature_image")),
            "profile_image": get_first_item(api_response.get("profile_image"))
        },

        "declaration_details": {
            "declaration_agreed": api_response.get("field_73388") == ["I Agree"],
            "applicant_name": api_response.get("field_73389_14448", ""),
            "parent_name": api_response.get("field_73389_14449") or None,
            "declaration_date": timestamp_to_date(api_response.get("field_73389_14450")),
            "place": api_response.get("field_73389_14451", "")
        },

        "deb_details": {
            "deb_id": api_response.get("deb_id", ""),
            "deb_name": api_response.get("deb_applicant_name") or None,
            "deb_gender": api_response.get("deb_gender") or None,
            "deb_date_of_birth": api_response.get("deb_date_of_birth") or None,
            "deb_university": api_response.get("deb_university_name") or None,
            "deb_program": api_response.get("deb_program") or None,
            "deb_abcid": api_response.get("deb_abcid") or None,
            "deb_status": api_response.get("deb_status") or None
        },

        "application_fee": {
            "order_id": api_response.get("field_77806"),  # Application Fee Order ID
            "transaction_id": api_response.get("field_77805"),  # Application Fee Transaction ID
            "payment_date": parse_date(api_response.get("field_77804")),  # Application Fee Payment Date
            "payment_amount": safe_float(api_response.get("field_77803", 0.0)),  # Application Fee Balance Amount
            "is_offline": bool(api_response.get("field_77311", False)),  # Enable Offline Application Fee Receipt
            "offline_transaction_id": api_response.get("field_77309") if api_response.get("field_77311") else None,  # Offline Application Transaction ID
            "offline_payment_method": api_response.get("field_77310") if api_response.get("field_77311") else None,  # Offline Application Payment Method
            "offline_receipt_enabled": bool(api_response.get("field_77311", False)),
        } if any([api_response.get(f) for f in ["field_77806", "field_77805", "field_77804"]]) else None,

        "semester_fees": [
            # 1st Semester Fee only (initial sync)
            {
                "order_id": api_response.get("field_77811"),  # 1st Semester Fee Order ID
                "transaction_id": api_response.get("field_77810"),  # 1st Semester Fee Transaction ID
                "payment_date": parse_date(api_response.get("field_77809")),  # 1st Semester Fee Payment Date
                "payment_amount": safe_float(api_response.get("field_77808", 0.0)),  # 1st Semester Fee Amount
                "semester": "1st",
                "lab_fee": safe_float(api_response.get("field_77125", 0.0)),  # 1st Semester Lab Fee
                "lms_fee": safe_float(api_response.get("field_77124", 0.0)),  # 1st Semester LMS Fee
                "exam_fee": safe_float(api_response.get("field_77123", 0.0)),  # 1st Semester Exam Fee
                "tuition_fee": safe_float(api_response.get("field_77122", 0.0)),  # 1st Semester Tuition Fee
                "total_fee": safe_float(api_response.get("field_77126", 0.0)),  # Total Fee 1st Semester
                "is_offline": False,
            } if any([api_response.get(f) for f in ["field_77811", "field_77810", "field_77809"]]) else None,
        ]
    }

    mapped_data["semester_fees"] = [fee for fee in mapped_data["semester_fees"] if fee is not None]
    return mapped_data

def map_patch_api_to_student_schema(api_response: dict) -> Dict[str, Any]:
    mapped_data = {
        "application_no": api_response.get("application_no"),

        "document_details": {
            "class_10th_marksheet": get_first_item(api_response.get("upload_10_marksheet")),
            "class_12th_marksheet": get_first_item(api_response.get("upload_12_marksheet")),
            "graduation_marksheet": api_response.get("upload_ug_marksheet") or None,
            "diploma_marksheet": api_response.get("upload_diplomamarkscard") or None,
            "work_experience_certificates": api_response.get("field_73434") or None,
            "passport": api_response.get("upload_passport") or None,
            "aadhar": get_first_item(api_response.get("color_copy_of_aadhar_card")),
            "signature": get_first_item(api_response.get("signature_image")),
            "profile_image": get_first_item(api_response.get("profile_image"))
        },
    }

    return mapped_data