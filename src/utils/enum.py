from enum import Enum

class ContactPreference(str, Enum):
    EMAIL = "Email"
    PHONE = "Phone"
    NONE = "None"
    status = "active"

class HonorificType(str, Enum):
    MR = "Mr."
    MRS = "Mrs."
    MS = "Ms."
    MISS = "Miss"
    DR = "Dr."
    PROF = "Prof."
    REV = "Rev."
    SIR = "Sir"
    MADAM = "Madam"

class GenderEnum(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class MaritalStatus(str, Enum):
    MARRIED = "married"
    UNMARRIED = "unmarried"

class Religion(str, Enum):
    HINDUISM = "Hinduism"
    CHRISTIANITY = "Christianity"
    ISLAM = "Islam"
    BUDDHISM = "Buddhism"
    JUDAISM = "Judaism"
    SIKHISM = "Sikhism"
    OTHER = "Other"
    ATHEIST = "Atheist"
    AGNOSTIC = "Agnostic"
    NO_RELIGION = "No religion"

class AddressType(str, Enum):
    PERMANENT = "PERMANENT"
    CORRESPONDENCE = "CORRESPONDENCE"

class BloodGroupEnum(str, Enum):
    AP = "A+"
    AN = "A-"
    BP = "B+"
    BN = "B-"
    ABP = "AB+"
    ABN = "AB-"
    OP = "O+"
    ON = "O-"

class CategoryEnum(str, Enum):
    GENERAL = "General"
    OBC = "OBC"
    SC = "SC"
    ST = "ST"
    OTHER = "Other"
    NOCASTE = "NoCaste"