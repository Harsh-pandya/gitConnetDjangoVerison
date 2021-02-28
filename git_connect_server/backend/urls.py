from django.contrib import admin
from django.urls import path
from backend.views import (
    GithubOAuth,
    TestEndPoint,
    PageValidation,
    SearchPage,
    GithubRepositoryList,
    ProjectView,
    ListProject,
)

urls = [
    path("", GithubOAuth.as_view(), name="GithubOAuth"),
    path("test-endpoint", TestEndPoint.as_view(), name="TestEndPoint"),
    path("page-validation", PageValidation.as_view(), name="PageValidation"),
    path("search-page", SearchPage.as_view(), name="SearchPage"),
    path(
        "fetch-project-list",
        GithubRepositoryList.as_view(),
        name="GithubRepositoryList",
    ),
    path("project", ProjectView.as_view(), name="ProjectView"),
    path("list-project", ListProject.as_view(), name="ListProject"),
]
