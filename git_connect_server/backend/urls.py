from django.contrib import admin
from django.urls import path
from .views import GithubOAuth, TestEndPoint

urls = [
    path("", GithubOAuth.as_view(), name="GithubOAuth"),
    path("test-endpoint/", TestEndPoint.as_view(), name="TestEndPoint"),
]
