import zipfile
import rarfile
import os
import shutil
from typing import List

class ArchiveManager:
    @staticmethod
    def extract_archive(file_path: str, extract_to: str) -> List[str]:
        extracted_files = []
        
        if not os.path.exists(extract_to):
            os.makedirs(extract_to)
            
        if file_path.endswith('.zip'):
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(extract_to)
                extracted_files = [os.path.join(extract_to, f) for f in zip_ref.namelist()]
        elif file_path.endswith('.rar'):
            # Note: rarfile requires unrar tool installed or path configured
            try:
                with rarfile.RarFile(file_path, 'r') as rar_ref:
                    rar_ref.extractall(extract_to)
                    extracted_files = [os.path.join(extract_to, f) for f in rar_ref.namelist()]
            except Exception as e:
                print(f"Error extracting RAR: {e}")
                
        return extracted_files
