
#!/usr/bin/env python3
"""
File Printer Script for RDAuswertung Test Setup

This script prints the contents of all files needed to set up the test infrastructure
for the RDAuswertung project. It reads and outputs each file's content in sequence.

Usage:
    python print_test_files.py
"""

import os
import sys
from pathlib import Path


def print_file_content(file_path):
    """
    Print the content of a single file with a header and footer for readability.

    Args:
        file_path (str): Path to the file to be printed
    """
    try:
        # Create Path object
        path = Path(file_path)

        # Print file header
        print("\n" + "=" * 80)
        print(f"FILE: {file_path}")
        print("=" * 80)

        # Check if file exists
        if not path.exists():
            print(f"ERROR: File not found!")
            return

        # Read and print file content
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
            print(content)

        # Print file footer
        print("=" * 80)
        print(f"END OF FILE: {file_path}")
        print("=" * 80)

    except Exception as e:
        print(f"ERROR reading file {file_path}: {str(e)}")


def main():
    # List of all required files for test setup
    required_files = [
        r"C:\Development\RDAuswertung\jest.config.js",
        r"C:\Development\RDAuswertung\jest.setup.js",
        r"C:\Development\RDAuswertung\tsconfig.json",
        r"C:\Development\RDAuswertung\package.json",
        r"C:\Development\RDAuswertung\next.config.js",

        r"C:\Development\RDAuswertung\tests\e2e\filtering.test.ts",
        r"C:\Development\RDAuswertung\tests\e2e\navigation.test.ts",
        r"C:\Development\RDAuswertung\tests\integration\api\standorte.test.ts",
        r"C:\Development\RDAuswertung\tests\integration\services\export.test.ts",
        r"C:\Development\RDAuswertung\tests\unit\components\raumbuch-table.test.tsx",
        r"C:\Development\RDAuswertung\tests\unit\hooks\use-raumbuch-data.test.ts",
        r"C:\Development\RDAuswertung\tests\unit\services\analysis.test.ts",

        r"C:\Development\RDAuswertung\src\components\raumbuch\raumbuch-table.tsx",
        r"C:\Development\RDAuswertung\src\hooks\use-raumbuch-data.ts",
        r"C:\Development\RDAuswertung\src\services\analysis\calculate-summary.ts",
        r"C:\Development\RDAuswertung\src\services\analysis\prepare-visualization.ts",
        r"C:\Development\RDAuswertung\src\services\analysis\raumbuch-analysis.ts",
        r"C:\Development\RDAuswertung\src\services\export\excel-export.ts",
        r"C:\Development\RDAuswertung\src\services\export\pdf-export.ts",

        r"C:\Development\RDAuswertung\src\app\api\standorte\route.ts",
        r"C:\Development\RDAuswertung\src\app\api\standorte\[id]\route.ts",
        r"C:\Development\RDAuswertung\src\app\api\export\excel\[id]\route.ts",
        r"C:\Development\RDAuswertung\src\app\api\export\pdf\[id]\route.ts",

        r"C:\Development\RDAuswertung\src\models\raumbuch.ts",
        r"C:\Development\RDAuswertung\src\models\standort.ts",
        r"C:\Development\RDAuswertung\src\schemas\raumbuch.schema.ts",
        r"C:\Development\RDAuswertung\src\schemas\standort.schema.ts",

        r"C:\Development\RDAuswertung\src\lib\db.ts",
        r"C:\Development\RDAuswertung\src\lib\utils.ts",
        r"C:\Development\RDAuswertung\src\lib\validators.ts",
        r"C:\Development\RDAuswertung\src\lib\formatters.ts",

        r"C:\Development\RDAuswertung\src\types\database.types.ts",
        r"C:\Development\RDAuswertung\src\types\raumbuch.types.ts",
        r"C:\Development\RDAuswertung\src\types\standort.types.ts",

        r"C:\Development\RDAuswertung\src\services\database\client.ts",
        r"C:\Development\RDAuswertung\src\services\database\queries.ts",
        r"C:\Development\RDAuswertung\src\config\database.ts",

        r"C:\Development\RDAuswertung\src\components\ui\table.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\button.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\card.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\select.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\alert.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\input.tsx",
        r"C:\Development\RDAuswertung\src\components\ui\loader.tsx"
    ]

    # Print a summary of files to be processed
    print(f"Preparing to print {len(required_files)} files for RDAuswertung test setup...")

    # Process each file
    for file_path in required_files:
        print_file_content(file_path)

    print("\nFile printing completed.")


if __name__ == "__main__":
    main()