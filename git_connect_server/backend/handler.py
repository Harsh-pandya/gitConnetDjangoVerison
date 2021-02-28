import requests
import os
import json

from pymongo import MongoClient
from bson.objectid import ObjectId

from django_middleware_global_request.middleware import get_request

GITHUB_SECRET = os.environ.get("GITHUB_SECRET")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_ID")

client = MongoClient("localhost", 27017)
user_collection = client["gitconnect"]["user"]
project_collection = client["gitconnect"]["project"]
search_collection = client["gitconnect"]["search"]
SEARCH_ID = ObjectId("603b9746eaebc306575fa974")


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


def get_access_token(request=None):
    if request is None:
        request = get_request()
    access_token = request.session["access_token"]
    print(access_token)
    return access_token


def get_user_object_id(request=None):
    if request is None:
        request = get_request()
    user_object_id = request.session["user_object_id"]
    return user_object_id


class StoreUser:
    @staticmethod
    def find_or_add_user(user_info=None):
        """
        find the user into user_collections.
        If user is not there then create one
        and return user `_id`.

        Args:
            user_info (dict): user_info contains following field,
                username (github)
                userid (github)
                email (github)
                avatar (github)
                githubURL (github)
                linkedinURL (additional_field)
                stackoverflowURL (additional_field)
                skills (additional_field)
                contributions (additional_field)
                bookmarks (additional_field)
                owner (additional_field)
                incoming (additional_field)
                outgoing (additional_field)
                notification_bucket (additional_field)

        Returns:
            [bson.object.ObjectId]: user_objectId
        """
        user_id = user_info["userid"]
        user = user_collection.find_one(filter={"userid": user_id})
        if user == None:
            user = user_collection.insert_one(user_info)
            return str(user.inserted_id)
        else:
            return str(user["_id"])

    @staticmethod
    def fetch_and_crete_user_details():
        user = GithubEndpointFetch.fetch_user()
        user_details = {
            "username": user["login"],
            "userid": user["login"],
            "email": "",
            "avatar": user["avatar_url"],
            "githubURL": user["html_url"],
            "linkedinURL": "",
            "stackoverflowURL": "",
            "skills": [],
            "contributions": [],
            "bookmarks": [],
            "owner": [],
            "incoming": [],
            "outgoing": [],
            "notification_bucket": [],
        }
        user_object_id = StoreUser.find_or_add_user(user_info=user_details)
        return user_object_id


class SearchPageHandler:
    @staticmethod
    def fetch_project(search_info):
        """
        fetch projects containing search_query in tags.
        final return dict contains two additional field
            1. bookmark
            2. contribution
        value of this fields is based on user's bookmarks and
        contributions.

        Args:
            search_info (dict):
                USER_ID (bson.object.ObjectId)
                search_query (string)

        Returns:
            project_list (list[:dict])
        """
        search = search_collection.find_one({"_id": SEARCH_ID})
        user = user_collection.find_one({"_id": search_info["USER_ID"]})
        user_bookmarks = user["bookmarks"]
        user_contributions = user["contributions"]
        user_outgoing = user["outgoing"]
        try:
            project_id_list = search[search_info["search_query"]]
        except KeyError:
            project_id_list = None
        except AttributeError:
            project_id_list = None
        if project_id_list != None:
            projects_list = list()
            for id in project_id_list:
                project = project_collection.find_one({"_id": id})
                project["bookmark"] = True if id in user_bookmarks else False
                project["requested"] = (
                    True if id in user_contributions or id in user_outgoing else False
                )
                projects_list.append(project)
            return projects_list
        else:
            return []

    @staticmethod
    def create_and_fetch_search_details(search_query):
        search_info = {"USER_ID": get_user_object_id(), "search_query": search_query}
        return SearchPageHandler.fetch_project(search_info=search_info)


class ProjectHandler:
    @staticmethod
    def add_project(project_info):
        """
        add new project to database as user is owner.
        add project ids to search_collection accroding to tags.

        Args:
            project_info (dict): project_info contains following,
                owner: USER_ID (bson.object.ObjectId)
                projectTitle (string)
                projectDescription (string)
                projectUrl (string)
                projectSkills (array)
                projectOpenings (integer)
        """
        project = project_collection.insert_one(project_info)
        user = user_collection.find_one({"_id": project_info["owner"]})
        list1 = user["owner"]
        list1.append(project.inserted_id)
        user_collection.find_one_and_update(
            {"_id": project_info["owner"]},
            {
                "$set": {
                    "owner": list1,
                }
            },
            upsert=False,
        )

        key = search_collection.find_one({"_id": SEARCH_ID})
        for skill in project_info["projectSkills"]:
            try:
                value_list = key[skill]
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID}, {"$set": {skill: value_list}}, upsert=False
                )
            except AttributeError:
                value_list = list()
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            skill: value_list,
                        }
                    },
                    upsert=False,
                )
            except KeyError:
                value_list = list()
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            skill: value_list,
                        }
                    },
                    upsert=False,
                )

    @staticmethod
    def update_project(project_info):
        """
        update project to database.
        alter search_database based on tags.

        Args:
            project_info (dict): project_info contains following,
                PROJECT_ID (bson.object.ObjectId)
                "projectUrl" (string)
                "projectTitle" (string)
                "projectDescription" (string)
                "projectOpenings" (array)
                "projectSkills" (integer)
        """
        old_skills = set(
            project_collection.find_one({"_id": project_info["_id"]})["projectSkills"]
        )
        new_skills = set(project_info["projectSkills"])
        add_to_search = list(new_skills - old_skills)
        remove_to_search = list(old_skills - new_skills)
        project_collection.find_one_and_update(
            {"_id": project_info["_id"]},
            {
                "$set": {
                    "projectUrl": project_info["projectUrl"],
                    "projectTitle": project_info["projectTitle"],
                    "projectDescription": project_info["projectDescription"],
                    "projectOpenings": project_info["projectOpenings"],
                    "projectSkills": project_info["projectSkills"],
                }
            },
            upsert=False,
        )
        search_data = search_collection.find_one({"_id": SEARCH_ID})
        for add in add_to_search:
            try:
                value_list = search_data[add]
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
            except AttributeError:
                value_list = list()
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
            except KeyError:
                value_list = list()
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
        for remove in remove_to_search:
            try:
                value_list = search_data[remove]
                value_list.remove(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            remove: value_list,
                        }
                    },
                    upsert=False,
                )
            except:
                raise ValueError(
                    f"This is never gone be executed, find remove_tag {remove}"
                )

    @staticmethod
    def remove_project(project_info):
        project_collection.delete_one({"_id": project_info["PROJECT_ID"]})
        user_owner = user_collection.find_one({"_id": project_info["USER_ID"]})["owner"]
        user_owner.remove(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "owner": user_owner,
                }
            },
        )

    @staticmethod
    def fetch_and_remove_project(project_id):
        project_info = {
            "PROJECT_ID": ObjectId(project_id["_id"]),
            "USER_ID": ObjectId(get_user_object_id()),
        }
        ProjectHandler.remove_project(project_info=project_info)

    @staticmethod
    def get_user_project(user_id):
        user_owner = user_collection.find_one({"_id": user_id})["owner"]
        project_list = list()
        for id in user_owner:
            projets = project_collection.find_one({"_id": id})
            projets["_id"] = str(projets["_id"])
            projets["owner"] = str(projets["owner"])
            project_list.append(projets)
        return project_list

    @staticmethod
    def fetch_and_create_project_info(project_data):
        user_object_id = get_user_object_id()
        project_info = {
            "owner": ObjectId(user_object_id),
            "projectUrl": project_data["projectTitle"],
            "projectTitle": project_data["projectTitle"].split("/")[-1],
            "projectDescription": project_data["projectDescription"],
            "projectOpenings": project_data["projectOpenings"],
            "projectSkills": project_data["projectSkills"],
        }
        ProjectHandler.add_project(project_info=project_info)

    @staticmethod
    def fetch_and_get_list_of_owner_project():
        user_object_id = get_user_object_id()
        return ProjectHandler.get_user_project(user_id=ObjectId(user_object_id))

    @staticmethod
    def fetch_and_update_project_info(project_data):
        project_data["_id"] = ObjectId(project_data["_id"])
        project_data["owner"] = ObjectId(project_data["owner"])
        ProjectHandler.update_project(project_info=project_data)


class GithubProjectList:
    @staticmethod
    def fetch_and_process_repo_list():
        repo_data_list = GithubEndpointFetch.fetch_repo_list()
        processed_list = []
        base_url = "https://github.com"
        for repo in repo_data_list:
            full_name = repo["full_name"]
            value = f"{base_url}/{full_name}"
            processed_list.append({"value": value, "label": full_name.split("/")[-1]})
        return processed_list


class GithubEndpointFetch:
    @staticmethod
    def fetch_user():
        access_token = get_access_token()
        response = requests.get(
            url="https://api.github.com/user",
            headers={
                "Authorization": "Bearer " + access_token,
                "accept": "application/json",
            },
        )
        data = json.loads(response.content)
        return data

    @staticmethod
    def fetch_repo_list():
        access_token = get_access_token()
        response = requests.get(
            url="https://api.github.com/user/repos",
            headers={
                "Authorization": "Bearer " + access_token,
                "accept": "application/json",
            },
        )
        data = json.loads(response.content)
        return data
