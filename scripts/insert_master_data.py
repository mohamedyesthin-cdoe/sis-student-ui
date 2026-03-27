"""
Script to insert sample data for Academic Years, Batches, and Semester Masters.

Usage:
    python scripts/insert_master_data.py
    or from project root: python -m scripts.insert_master_data
"""
import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from src.db.session import SessionLocal, engine
from src.models.master import AcademicYear, Batch, SemesterMaster

def insert_sample_data():
    """Insert sample data into the master tables."""
    db = SessionLocal()
    
    try:
        # Create Academic Years
        print("Creating Academic Years...")
        
        academic_year_2025_26 = AcademicYear(
            year_code="2025-26",
            start_year=2025,
            end_year=2026,
            start_month=7,
            end_month=6,
            is_active=True,
            description="Academic Year 2025-26 (July 2025 - June 2026)"
        )
        db.add(academic_year_2025_26)
        db.flush()
        
        academic_year_2024_25 = AcademicYear(
            year_code="2024-25",
            start_year=2024,
            end_year=2025,
            start_month=7,
            end_month=6,
            is_active=False,
            description="Academic Year 2024-25 (July 2024 - June 2025)"
        )
        db.add(academic_year_2024_25)
        db.flush()
        
        print(f"✓ Academic Years created")
        
        # Create Batches for 2025-26
        print("Creating Batches...")
        
        batch_1_2025 = Batch(
            academic_year_id=academic_year_2025_26.id,
            batch_number=1,
            batch_name="Batch 1 (July-Dec)",
            start_month=7,
            end_month=12,
            is_active=True,
            description="First batch: July to December 2025"
        )
        db.add(batch_1_2025)
        
        batch_2_2025 = Batch(
            academic_year_id=academic_year_2025_26.id,
            batch_number=2,
            batch_name="Batch 2 (Jan-Jun)",
            start_month=1,
            end_month=6,
            is_active=True,
            description="Second batch: January to June 2026"
        )
        db.add(batch_2_2025)
        
        db.flush()
        print(f"✓ Batches created")
        
        # Create Semester Masters for UG (8 semesters)
        print("Creating Semester Masters...")
        
        ug_semesters = [
            {"number": 1, "name": "Semester 1"},
            {"number": 2, "name": "Semester 2"},
            {"number": 3, "name": "Semester 3"},
            {"number": 4, "name": "Semester 4"},
            {"number": 5, "name": "Semester 5"},
            {"number": 6, "name": "Semester 6"},
            {"number": 7, "name": "Semester 7"},
            {"number": 8, "name": "Semester 8"},
        ]
        
        for sem in ug_semesters:
            semester = SemesterMaster(
                program_type="UG",
                semester_number=sem["number"],
                semester_name=sem["name"],
                is_active=True,
                description=f"Undergraduate {sem['name']}"
            )
            db.add(semester)
        
        # Create Semester Masters for PG (4 semesters max)
        pg_semesters = [
            {"number": 1, "name": "Semester 1"},
            {"number": 2, "name": "Semester 2"},
            {"number": 3, "name": "Semester 3"},
            {"number": 4, "name": "Semester 4"},
        ]
        
        for sem in pg_semesters:
            semester = SemesterMaster(
                program_type="PG",
                semester_number=sem["number"],
                semester_name=sem["name"],
                is_active=True,
                description=f"Postgraduate {sem['name']}"
            )
            db.add(semester)
        
        db.flush()
        print(f"✓ Semester Masters created (UG: 8, PG: 4)")
        
        # Commit all changes
        db.commit()
        
        print("\n✅ All sample data inserted successfully!")
        
        # Print summary
        print("\n=== Summary ===")
        print(f"Academic Years: {db.query(AcademicYear).count()}")
        print(f"Batches: {db.query(Batch).count()}")
        print(f"Semester Masters: {db.query(SemesterMaster).count()}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error occurred: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    insert_sample_data()
