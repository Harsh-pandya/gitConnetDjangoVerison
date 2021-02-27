import React from "react";
import "./notification.style.scss";

import CardGrid from "../../components/cardgrid/cardgrid.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import TextCard from "../../components/text-card/text-card.component";
import Card from "../../components/card/card.component";
import VerticalScroll from "../../components/vertical-scroll/vertical-scroll.component";
import ProjectCardView from "../../components/projectcardview/projectcardview.component";
import CardList from "../../components/cardlist/cardlist.component";
import CollabrationNotificationCard from "../../components/collabration-notification-card/collabration-notification-card.component";
import ContributionNotificationCard from "../../components/contribution-notification-card/contribution-notification-card.component";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Notification extends React.Component {
  constructor() {
    super();

    this.state = {
      collabrations: [
        {
          user: "purvesh",
          requestedProject: "gitConnet-1",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-2",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-3",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-4",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-5",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-6",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-7",
        },
        {
          user: "purvesh",
          requestedProject: "gitConnet-8",
        },
      ],
      contributions: [
        {
          status: "Ongoing",
          requestedProject: "gitConnet-1",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-2",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-3",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-4",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-5",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-6",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-7",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-8",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-9",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-10",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-11",
        },
        {
          status: "Ongoing",
          requestedProject: "gitConnet-12",
        },
      ],
    };
  }

  acceptCollabartion() {
    toast.success("You find a Collabrator!!");
  }

  rejectCollabration() {
    toast.error("Collabration Request Rejected.");
  }

  removeNotification() {
    toast.error("Notification Removed from Tray.");
  }

  resetCollabrationKey() {
    this.state.collabrations.forEach((collabration, i) => {
      collabration.key = i + 1;
    });
  }

  resetContributionKey() {
    this.state.contributions.forEach((contribution, i) => {
      contribution.key = i + 1;
    });
  }

  removeCollbrationProject = (id) => {
    this.setState({
      collabrations: this.state.collabrations.filter((project) => {
        return project.key !== id;
      }),
    });
  };

  removeContributionProject = (id) => {
    this.setState({
      contributions: this.state.contributions.filter((project) => {
        return project.key !== id;
      }),
    });
  };

  render() {
    toast.configure();
    return (
      <div className="notification">
        <TextCard text="Notifications" />
        <br />
        <br />
        <CardGrid gridColumn="1fr 1fr">
          <Card>
            <h2 className="inner-header">Collabration Requests</h2>
            <VerticalScroll height="520px">
              <CardList>
                {
                  (this.resetCollabrationKey(),
                  this.state.collabrations.map((collabration) => (
                    <CollabrationNotificationCard
                      user={collabration.user}
                      requestedProject={collabration.requestedProject}
                    >
                      <CustomButton
                        title="Accept"
                        onClick={() => (
                          this.removeCollbrationProject(collabration.key),
                          this.acceptCollabartion()
                        )}
                      />
                      <CustomButton
                        title="Reject"
                        onClick={() => (
                          this.removeCollbrationProject(collabration.key),
                          this.rejectCollabration()
                        )}
                      />
                    </CollabrationNotificationCard>
                  )))
                }
              </CardList>
            </VerticalScroll>
          </Card>
          <Card>
            <h2 className="inner-header">Contribution Requests</h2>
            <VerticalScroll height="520px">
              <CardList>
                {
                  (this.resetContributionKey(),
                  this.state.contributions.map((contribution) => (
                    <ContributionNotificationCard
                      requestedProject={contribution.requestedProject}
                      status={contribution.status}
                    >
                      <CustomButton
                        title="Remove"
                        onClick={() => (
                          this.removeContributionProject(contribution.key),
                          this.removeNotification()
                        )}
                      />
                    </ContributionNotificationCard>
                  )))
                }
              </CardList>
            </VerticalScroll>
          </Card>
        </CardGrid>
      </div>
    );
  }
}

export default Notification;
