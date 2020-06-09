import asyncio
from typing import Dict, Optional
import json
import os

import gspread
from gspread.exceptions import WorksheetNotFound
from gspread.utils import rowcol_to_a1
from libkol import Session

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
KOL_USERNAME = os.getenv("KOL_USERNAME")
KOL_PASSWORD = os.getenv("KOL_PASSWORD")

def process_row(sheet, data: Dict[str, str]) -> Optional[str]:
    project = data.pop("_PROJECT", None)
    if project is None:
        return "No project key"

    try:
        ws = sheet.worksheet(project)
        headers = ws.row_values(1)
    except WorksheetNotFound:
        headers = list(data.keys())
        ws = sheet.add_worksheet(title=project, rows=1, cols=len(headers))
        ws.insert_row(headers)
        ws.format(f"A1:{rowcol_to_a1(1, len(headers))}", {"textFormat": {"bold": True}})

    data_to_insert = [data.get(k, '') for k in headers]

    if any(i for i in range(2, ws.row_count + 1) if ws.row_values(i) == data_to_insert):
        return "Discarded as duplicate"

    ws.append_row(data_to_insert)
    return None

async def main():
    gc = gspread.service_account(filename='./credentials.json')
    sheet = gc.open_by_key(SPREADSHEET_ID)

    async with Session() as kol:
        await kol.login(KOL_USERNAME, KOL_PASSWORD)

        messages = await kol.kmail.get()

        for message in messages:
            error = None
            try:
                text = message.text.replace(" ", "").replace("+", " ")
                data = json.loads(text)
                data = {"user_id": message.user_id, **data}

                error = process_row(sheet, data)
            except json.JSONDecodeError:
                error = "Error decoding message"
                pass
            
            if error is not None:
                print(f"[{message.username}] {error}")
            else:
                print(f"[{message.username}] Success")

            # await kol.kmail.delete(message.id)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()