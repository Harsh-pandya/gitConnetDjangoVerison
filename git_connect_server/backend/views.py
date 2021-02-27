from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from .handler import ExchangeCode


class GithubOAuth(APIView):
    def get(self, request: Request):
        code = request.GET["code"]
        data = ExchangeCode.exchange_code(code)
        request.session["access_code"] = data["access_token"]
        # Update Or Create User Profile Data.
        # Store User object id
        return HttpResponseRedirect("http://localhost:3000/search/")


class TestEndPoint(APIView):
    def get(self, request: Request):
        print(request.session.items())
        return Response()