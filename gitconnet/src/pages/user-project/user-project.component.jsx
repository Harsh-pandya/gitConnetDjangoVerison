import React from "react";
import "./user-project.style.scss";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";

import TextCard from "../../components/text-card/text-card.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import CardGrid from "../../components/cardgrid/cardgrid.component";
import CardList from "../../components/cardlist/cardlist.component";
import Card from "../../components/card/card.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import SkillCard from "../../components/skill-card/skill-card.component";
import FormInput from "../../components/form-input/form-input.component";
import ProjectEditSkill from "../../components/project-edit-skill/project-edit-skill.component";
import CancelButton from "../../components/cancel-button/cancel-button.component";
import FormTextbox from "../../components/form-textbox/form-textbox.component";
import FormTextArea from "../../components/form-textarea/form-textarea.component";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    borderBottom: "1px dotted pink",
    color: state.selectProps.menuColor,
    padding: 20,
  }),

  control: (_, { selectProps: { width } }) => ({
    width: width,
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};

class UserProject extends React.Component {
  constructor(props) {
    super();

    this.state = {
      isAddProject: false,
      isEditProject: false,
      editProjectKey: null,
      tempSkill: "",
      newProjectTitle: "",
      newProjectDescription: "",
      newProjectURL: "",
      newProjectSkills: [],
      selectedOption: null,
      github_projects: [
        { value: "project-1", label: "project-1" },
        { value: "project-2", label: "project-2" },
        { value: "project-3", label: "project-3" },
        { value: "project-4", label: "project-4" },
        { value: "project-5", label: "project-5" },
        { value: "project-6", label: "project-6" },
        { value: "project-7", label: "project-7" },
      ],
      projects: [
        {
          title: "project-1",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: [
            "python",
            "reactJS",
            "python",
            "reactJS",
            "python",
            "reactJS",
            "python",
            "reactJS",
            "python",
            "reactJS",
            "python",
            "reactJS",
            "python",
            "reactJS",
          ],
          opening: 11,
        },
        {
          title: "project-2",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-3",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-4",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-5",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-6",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-7",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
        {
          title: "project-8",
          description:
            "This is a small description of this project-1. BEtter fit in size to avoid overflow and make CSS ugly.",
          skills: ["python", "reactJS"],
          opening: 11,
        },
      ],
    };
  }

  resetKey() {
    this.state.projects.forEach((project, i) => {
      project.key = i + 1;
    });
  }

  removeProject = (id) => {
    this.setState({
      projects: this.state.projects.filter((project) => {
        return project.key !== id;
      }),
    });
  };

  addSkill = (id) => {
    this.state.projects[id].skills.unshift(this.state.tempSkill);
    this.setState(({ projects }) => ({
      projects: [
        ...projects.slice(0, id),
        {
          ...projects[id],
          skills: this.state.projects[id].skills,
        },
        ...projects.slice(id + 1),
      ],
      tempSkill: "",
    }));
  };

  removeSkill = (remove_skill, id) => {
    this.setState(({ projects }) => ({
      projects: [
        ...projects.slice(0, id),
        {
          ...projects[id],
          skills: this.state.projects[id].skills.filter((skill) => {
            return skill !== remove_skill;
          }),
        },
        ...projects.slice(id + 1),
      ],
    }));
  };

  editProjectDetails = (id) => {
    return (
      <div className="edit-project-section">
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <VerticalScroll height="500px">
              <div className="title-section">
                <div className="title-card">
                  <Card>
                    <h3>Title</h3>
                  </Card>
                </div>
                <div className="title-input">
                  <FormInput
                    placeholder="Enter Title"
                    value={this.state.projects[id].title}
                    onChange={(e) => {
                      this.setState(({ projects }) => ({
                        projects: [
                          ...projects.slice(0, id),
                          {
                            ...projects[id],
                            title: e.target.value,
                          },
                          ...projects.slice(id + 1),
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="discription-section">
                <div className="discription-card">
                  <Card>
                    <h3>Description</h3>
                  </Card>
                </div>
                <div className="discription-input">
                  <FormTextArea
                    placeholder="Enter Description"
                    value={this.state.projects[id].description}
                    onChange={(e) => {
                      this.setState(({ projects }) => ({
                        projects: [
                          ...projects.slice(0, id),
                          {
                            ...projects[id],
                            description: e.target.value,
                          },
                          ...projects.slice(id + 1),
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="opening-section">
                <div className="opening-card">
                  <Card>
                    <h3>Openings</h3>
                  </Card>
                </div>
                <div className="opening-input">
                  <FormInput
                    placeholder="Enter Project Opening"
                    value={this.state.projects[id].opening}
                    onChange={(e) => {
                      this.setState(({ projects }) => ({
                        projects: [
                          ...projects.slice(0, id),
                          {
                            ...projects[id],
                            opening: e.target.value,
                          },
                          ...projects.slice(id + 1),
                        ],
                      }));
                    }}
                  />
                </div>
              </div>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Required Skill</h2>
            <div className="add-new-skill">
              <div className="add-new-skill-input">
                <FormInput
                  placeholder="Skill"
                  value={this.state.tempSkill}
                  onChange={(e) => {
                    this.setState({ tempSkill: e.target.value });
                  }}
                />
              </div>
              <CustomButton
                title="Add Skill"
                onClick={() => this.addSkill(id)}
              />
            </div>
            <br />
            <br />
            <div className="user-project-edit-skill">
              <VerticalScroll height="300px">
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.projects[id].skills.map((skill) => {
                    return (
                      <ProjectEditSkill skill={skill}>
                        <CancelButton
                          onClick={() => this.removeSkill(skill, id)}
                        />
                      </ProjectEditSkill>
                    );
                  })}
                </CardGrid>
              </VerticalScroll>
            </div>
          </Card>
        </CardGrid>
        <br />
        <div className="custom-save">
          <CustomButton
            title="Save Details"
            onClick={() => {
              this.setState({ isEditProject: false });
              this.successNotification();
            }}
          />
        </div>
        <br />
      </div>
    );
  };

  selectProject = (selectedOption) => {
    this.setState({ newProjectTitle: selectedOption.value });
  };

  addNewProject = () => {
    return (
      <div className="add-project-section">
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <VerticalScroll height="500px">
              <div className="title-section">
                <div className="title-card">
                  <Card>
                    <h3>Title</h3>
                  </Card>
                </div>
                <Select
                  className="dropdown"
                  options={this.state.github_projects}
                  onChange={this.selectProject}
                  placeholder="Select Project"
                  styles={customStyles}
                />
              </div>
              <br />
              <br />
              <div className="discription-section">
                <div className="discription-card">
                  <Card>
                    <h3>Description</h3>
                  </Card>
                </div>
                <div className="discription-input">
                  <FormTextArea
                    placeholder="Enter Discription"
                    value={this.state.newProjectDescription}
                    onChange={(e) => {
                      this.setState({ newProjectDescription: e.target.value });
                    }}
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="opening-section">
                <div className="opening-card">
                  <Card>
                    <h3>Openings</h3>
                  </Card>
                </div>
                <div className="opening-input">
                  <FormInput
                    placeholder="Enter Project URL"
                    value={this.state.newProjectURL}
                    onChange={(e) => {
                      this.setState({ newProjectURL: e.target.value });
                    }}
                  />
                </div>
              </div>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Required Skill</h2>
            <div className="add-new-skill">
              <div className="add-new-skill-input">
                <FormInput
                  placeholder="Skill"
                  value={this.state.tempSkill}
                  onChange={(e) => {
                    this.setState({ tempSkill: e.target.value });
                  }}
                />
              </div>
              <CustomButton
                title="Add Skill"
                onClick={() => {
                  this.state.newProjectSkills.unshift(this.state.tempSkill);
                  this.setState({
                    newProjectSkills: this.state.newProjectSkills,
                    tempSkill: "",
                  });
                }}
              />
            </div>
            <br />
            <br />
            <div className="user-project-edit-skill">
              <VerticalScroll height="300px">
                <CardGrid gridColumn="1fr 1fr 1fr">
                  {this.state.newProjectSkills.map((skill) => {
                    return (
                      <ProjectEditSkill skill={skill}>
                        <CancelButton
                          onClick={() => {
                            this.setState({
                              newProjectSkills: this.state.newProjectSkills.filter(
                                (newSkill) => {
                                  return newSkill !== skill;
                                }
                              ),
                            });
                          }}
                        />
                      </ProjectEditSkill>
                    );
                  })}
                </CardGrid>
              </VerticalScroll>
            </div>
          </Card>
        </CardGrid>
        <br />
        <div className="add-remove-project">
          <CardGrid gridColumn="1fr 1fr">
            <div className="custom-save">
              <CustomButton
                title="Save Details"
                onClick={() => {
                  this.state.projects.unshift({
                    title: this.state.newProjectTitle,
                    description: this.state.newProjectDescription,
                    skills: this.state.newProjectSkills,
                  });
                  this.setState({
                    isAddProject: false,
                    projects: this.state.projects,
                    newProjectTitle: "",
                    newProjectDescription: "",
                    newProjectSkills: [],
                    newProjectURL: "",
                  });
                  console.log(this.state.projects);
                  this.successNotification();
                }}
              />
            </div>
            <div className="discard-save">
              <CustomButton
                title="Discard Project"
                onClick={() => {
                  this.setState({
                    isAddProject: false,
                    newProjectTitle: "",
                    newProjectDescription: "",
                    newProjectSkills: [],
                    newProjectURL: "",
                  });
                  this.discardNotification();
                }}
              />
            </div>
            <br />
          </CardGrid>
        </div>
      </div>
    );
  };

  renderProjects() {
    return (
      <div className="projects-section">
        <VerticalScroll height="600px">
          <CardList>
            {
              (console.log(this.state),
              this.state.projects.map((project) => (
                <ProjectCardView
                  projectTitle={project.title}
                  projectDescription={project.description}
                  projectSkill={project.skills}
                  projectOpening={project.opening}
                >
                  <CardGrid gridColumn="1fr 1fr">
                    <CustomButton
                      title="Edit Details"
                      onClick={() => (
                        this.resetKey(),
                        this.setState({
                          isEditProject: true,
                          editProjectKey: project.key,
                        })
                      )}
                    />
                    <CustomButton
                      title="Remove Project"
                      onClick={() => (
                        this.resetKey(),
                        this.removeProject(project.key),
                        this.removeNotification()
                      )}
                    />
                  </CardGrid>
                </ProjectCardView>
              )))
            }
          </CardList>
        </VerticalScroll>
      </div>
    );
  }

  renderChoice() {
    if (this.state.isEditProject) {
      return this.editProjectDetails(this.state.editProjectKey - 1);
    } else {
      if (this.state.isAddProject) {
        return this.addNewProject();
      } else {
        return this.renderProjects();
      }
    }
  }

  successNotification() {
    toast.success("Project Successfully Saved.");
  }

  discardNotification() {
    toast.warning("Project Details Discard.");
  }

  removeNotification() {
    toast.error("Project Removed.");
  }

  renderMainButton() {
    if (this.state.isEditProject) {
      return (
        <CustomButton
          title="Save Details"
          onClick={() => {
            this.setState({ isEditProject: false });
            this.successNotification();
          }}
        />
      );
    } else {
      if (this.state.isAddProject) {
        <CustomButton
          title="Save Details"
          onClick={() => {
            this.setState({ isAddProject: false });
            this.successNotification();
          }}
        />;
      } else {
        return (
          <CustomButton
            title="Add Project"
            onClick={() => {
              this.setState({ isAddProject: true });
            }}
          />
        );
      }
    }
  }

  render() {
    toast.configure();
    return (
      <div className="user-project">
        <div className="project-header">
          <TextCard text="Projects" />
          {this.renderMainButton()}
        </div>
        <br />
        <br />
        <Card>{this.renderChoice()}</Card>
      </div>
    );
  }
}

export default UserProject;
