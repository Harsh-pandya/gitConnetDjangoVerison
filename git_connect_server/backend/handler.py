import requests
import os
import json

GITHUB_SECRET = os.environ.get("GITHUB_SECRET")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_ID")
print(GITHUB_CLIENT_ID, GITHUB_SECRET)


class ExchangeCode:
    @staticmethod
    def exchange_code(code):
        response = requests.post(
            url="https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_SECRET,
                "code": code,
            },
            headers={"accept": "application/json"},
        )
        data = json.loads(response.content)
        return data


class StoreUser:
    def update_create(access_code):
        pass