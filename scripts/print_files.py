#!/usr/bin/env python3
"""
Script to print the contents of specified files in the RDAuswertung project.
This script can be run from any directory within the project.
"""

import os
import sys

# List of files to print
files_to_print = [
    # Datenmodelle und Typen
    "src/types/raumbuch.types.ts",
    "src/types/standort.types.ts",
    "src/types/database.types.ts",
    "src/models/raumbuch.ts",
    "src/models/standort.ts",

    # Schemas
    "src/schemas/raumbuch.schema.ts",
    "src/schemas/standort.schema.ts",

    # Datenbankanbindung
    "src/lib/db.ts",
    "src/services/database/client.ts",
    "src/services/database/queries.ts",
    ".env",
    "prisma/schema.prisma",

    # API-Routen
    "src/app/api/raumbuch/route.ts",
    "src/app/api/raumbuch/[id]/route.ts",
    "src/app/api/standorte/route.ts",
    "src/app/api/standorte/[id]/route.ts",

    # Komponenten
    "src/components/raumbuch/raumbuch-table.tsx",
    "src/components/raumbuch/filter-bar.tsx",
    "src/components/raumbuch/summary-box.tsx",
    "src/components/raumbuch/summary-grid.tsx",

    # Hooks
    "src/hooks/use-raumbuch-data.ts",
    "src/hooks/use-standorte.ts",
    "src/hooks/use-filter.ts",

    # Services für Analyse und Export
    "src/services/analysis/raumbuch-analysis.ts",
    "src/services/analysis/calculate-summary.ts",
    "src/services/export/excel-export.ts",
    "src/services/export/pdf-export.ts"
]

def find_project_root():
    """Find the root directory of the project by traversing up until package.json is found."""
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # If the script is run directly, use the current working directory
    if os.path.basename(current_dir) == "scripts":
        parent_dir = os.path.dirname(current_dir)
        if os.path.exists(os.path.join(parent_dir, "package.json")):
            return parent_dir

    # Otherwise traverse up until we find package.json
    while True:
        if os.path.exists(os.path.join(current_dir, "package.json")):
            return current_dir

        parent_dir = os.path.dirname(current_dir)
        if parent_dir == current_dir:  # Reached the root directory
            return None

        current_dir = parent_dir

def print_file_content(file_path):
    """Print the content of a file with a header and footer for better readability."""
    separator = "=" * 80
    print(f"\n{separator}")
    print(f"FILE: {file_path}")
    print(separator)

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            print(content)
    except FileNotFoundError:
        print(f"ERROR: File not found: {file_path}")
    except Exception as e:
        print(f"ERROR: Could not read file: {file_path}")
        print(f"Reason: {str(e)}")

    print(f"{separator}\n")

def main():
    """Main function to print all specified files."""
    # Find the project root directory
    project_root = find_project_root()

    if not project_root:
        print("Error: Could not find the root directory of the RDAuswertung project.")
        print("Make sure this script is run from within the project directory structure.")
        sys.exit(1)

    # Change to the project root directory
    os.chdir(project_root)
    print(f"Working from project root: {project_root}\n")

    print("Starting to print files...\n")

    for file_path in files_to_print:
        print_file_content(file_path)

    print("Finished printing all files.")

if __name__ == "__main__":
    main()