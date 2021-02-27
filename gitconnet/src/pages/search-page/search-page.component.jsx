import React from "react";
import "./search-page.style.scss";

import FormInput from "../../components/form-input/form-input.component";
import Card from "../../components/card/card.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import CardList from "../../components/cardlist/cardlist.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import CardGrid from "../../components/cardgrid/cardgrid.component";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

class SearchPage extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: "",
      allProjects: [
        {
          user: "purvesh",
          projectTitle: "gitConnect-1",
          projectDescription: "This is small project for testing.",
          projectSkill: ["python", "aws", "babel", "aws", "babel"],
          bookmark: false,//aa nathi
          requested: false,// aa nathi
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-2",
          projectDescription: "This is small project for testing.",
          projectSkill: ["reactjs", "aws", "babel"],
          bookmark: true,
          requested: false,
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-3",
          projectDescription: "This is small project for testing.",
          projectSkill: ["aws", "babel"],
          bookmark: false,
          requested: false,
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-4",
          projectDescription: "This is small project for testing.",
          projectSkill: ["reactjs", "aws"],
          bookmark: false,
          requested: false,
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-5",
          projectDescription: "This is small project for testing.",
          projectSkill: ["python", "babel"],
          bookmark: false,
          requested: false,
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-6",
          projectDescription: "This is small project for testing.",
          projectSkill: ["reactjs", "aws", "babel"],
          bookmark: false,
          requested: false,
        },
        {
          user: "purvesh",
          projectTitle: "gitConnect-7",
          projectDescription: "This is small project for testing.",
          projectSkill: ["python", "reactjs", "aws", "babel"],
          bookmark: false,
          requested: false,
        },
      ],
    };
  }

  resetKey() {
    this.state.allProjects.forEach((project, i) => {
      project.key = i + 1;
    });
  }

  renderBookmark = (isBookmark, projectID) => {
    var id = projectID - 1;
    if (isBookmark) {
      console.log("Key: ", id);
      return (
        <CustomButton
          title="BookMarked"
          onClick={() => (
            this.setState(({ allProjects }) => ({
              allProjects: [
                ...allProjects.slice(0, id),
                {
                  ...allProjects[id],
                  bookmark: !this.state.allProjects[id].bookmark,
                },
                ...allProjects.slice(id + 1),
              ],
            })),
            this.falseBookmarkNotification()
          )
          }
        />
      );
    } else {
      console.log("Key: ", id);
      return (
        <CustomButton
          title="BookMark"
          onClick={() => (
            this.setState(({ allProjects }) => ({
              allProjects: [
                ...allProjects.slice(0, id),
                {
                  ...allProjects[id],
                  bookmark: !this.state.allProjects[id].bookmark,
                },
                ...allProjects.slice(id + 1),
              ],
            })),
            this.trueBookmarkNotification()
          )}
        />
      );
    }
  };

  renderRequested = (isRequested, projectID) => {
    var id = projectID - 1;
    if (isRequested) {
      return (
        <CustomButton
          title="Requested"
          onClick={() => (
            this.setState(({ allProjects }) => ({
              allProjects: [
                ...allProjects.slice(0, id),
                {
                  ...allProjects[id],
                  requested: !this.state.allProjects[id].requested,
                },
                ...allProjects.slice(id + 1),
              ],
            })),
            this.falseRequestedNotification()
          )}
        />
      );
    } else {
      return (
        <CustomButton
          title="Do Contribution"
          onClick={() => (
            this.setState(({ allProjects }) => ({
              allProjects: [
                ...allProjects.slice(0, id),
                {
                  ...allProjects[id],
                  requested: !this.state.allProjects[id].requested,
                },
                ...allProjects.slice(id + 1),
              ],
            })),
            this.trueRequestedNotification()
          )}
        />
      );
    }
  };

  trueBookmarkNotification() {
    toast.success("BookMark Successfully.");
  }

  trueRequestedNotification() {
    toast.success("Requested for Contribution.");
  }

  falseBookmarkNotification() {
    toast.error("BookMark Removed.");
  }

  falseRequestedNotification() {
    toast.error("Request Removed.");
  }

  searchQueryChange = (e) => {
    this.setState({
      "searchQuery": e.target.value
    })
    axios({
      method: "GET",
      url: "http://localhost:8000/api/test-endpoint/",
      data: {
        search: this.state.searchQuery
      },
      withCredentials: true
    }).then((response) => {
      console.log(response)
    }).catch((err) => {
      console.log(err)
    })
  }
  render() {
    toast.configure();
    const { allProjects, searchQuery } = this.state;

    // filter projects that contains searchQuery string and put search skill to
    // beginning of skills array using swapping.
    // remove the function below
    const filteredProjects = allProjects.filter((project) => {
      var element_index = project.projectSkill.indexOf(
        searchQuery.toLowerCase().trim()
      );
      console.log(element_index);
      if (element_index !== -1) {
        return ([
          project.projectSkill[0],
          project.projectSkill[element_index],
        ] = [project.projectSkill[element_index], project.projectSkill[0]]);
      }
    });

    const searchQueryLength = this.state.searchQuery.length;
    const filteredProjectLength = filteredProjects.length;

    return (
      <div className="search-page">
        <div className="search-bar">
          <FormInput
            placeholder="Search Project"
            onChange={(e) => {
              this.searchQueryChange(e)
            }}
          />
        </div>
        <br />
        <br />
        <Card>
          {searchQueryLength !== 0 ? (
            filteredProjectLength !== 0 ? (
              <VerticalScroll height="600px">
                <CardList>
                  {filteredProjects.map((project) => {
                    this.resetKey();
                    return (
                      <ProjectCardView
                        projectTitle={project.projectTitle}
                        projectDescription={project.projectDescription}
                        projectSkill={project.projectSkill}
                      >
                        <CardGrid gridColumn="1fr 1fr 1fr">
                          {this.renderBookmark(project.bookmark, project.key)}
                          <CustomButton
                            title="Github"
                            onClick={() =>
                              window.open("https://github.com", "_blank")
                            }
                          />
                          {this.renderRequested(project.requested, project.key)}
                        </CardGrid>
                      </ProjectCardView>
                    );
                  })}
                </CardList>
              </VerticalScroll>
            ) : (
                <h2 className="search-info">No Projects Found</h2>
              )
          ) : (
              <h2 className="search-info">Search Something</h2>
            )}
        </Card>
      </div>
    );
  }
}

export default SearchPage;
