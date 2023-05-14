import React from 'react';
import { Row, Col, CardTitle, Button, CardSubtitle } from 'reactstrap';
import * as Icon from 'react-feather';
import ComponentCard from '../components/ComponentCard';

import simg from '../assets/images/background/icons2.jpg';

const About = () => {
  return (
    <Row>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card-1*/}
        {/* --------------------------------------------------------------------------------*/}
        <ComponentCard
          title="Material Pro React Admin Pro Version"
          subtitle={
            <p>
              4 Dashboard Variations, 250+ Page Templates, 6 Color Schemes, 5 Unique Demos, 45+ UI Elements, 35+ Integrated Plugins, Login & Register system with Firebase and more...
            </p>
          }
        >
          <img src={simg} alt="icons" className="img-fluid rounded mb-4" />
          <Row>
            <Col lg="8">
              <div className="mt-3">
                <Button
                  color="primary"
                  href="https://www.wrappixel.com/templates/materialpro-react-redux-admin/?ref=33"
                  target="_blank"
                >
                  Buy Now
                </Button>
              </div>
            </Col>
          </Row>
        </ComponentCard>
        <ComponentCard title="Features">
          <Row>
            <Col lg="4" className="mb-4">
              <div className="text-center">
                <span>
                  <Icon.Grid size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Create React App Based
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Create React App is a tool that gives you a massive head start when building React
                  apps.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="mb-4">
              <div className="text-center">
                <span>
                  <Icon.Settings size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  React Hooks
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Hooks are functions that let you “hook into” React state and lifecycle features
                  from function components.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="mb-4">
              <div className="text-center">
                <span>
                  <Icon.Lock size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  CASL
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  It is isomorphic authorization JavaScript library which restricts what resources a
                  given client is allowed to access.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Moon size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Dark & Light Layouts
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Xtreme comes with built-in light and dark layouts, select as per your preference.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Feather size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Built-in Customizer
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Built-in customizer enables users to change their admin panel look & feel based on
                  their preferences.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Inbox size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Well Crafted Apps
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Creative & smart well crafted apps like email, chat, todo & calender allows you to
                  create your apps faster.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Aperture size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Clean & Modern Design
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Beautifully crafted, clean & modern designed admin theme with 5 different demos &
                  light - dark versions.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Link size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Easy Navigation
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Carefully crafted, clean, smart & easy theme navigation with collapsible option.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Slash size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  No jQuery Dependency
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  jQuery is great JS library, But It&apos;s not a great idea to use jQuery and React in
                  the same UI.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Target size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Colors Options
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Unlimited color options allows you to set your application color as per your
                  branding.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Repeat size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Code Splitting
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  To avoid winding up with a large bundle, it&apos;s good to get ahead of the problem and
                  use &quot;Code Splitting&quot;.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Loader size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Lazy Loading
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  It&apos;s more efficient to split each route&apos;s components into a separate chunk, and
                  only load them when the route is visited.
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.UploadCloud size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Continuous Updates
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Lifetime updates with new demos and features is guaranteed
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.CheckSquare size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Quality Code
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  We follow the best industry code structure that all developers will be able to
                  pick up easily and fall in love
                </CardSubtitle>
              </div>
            </Col>
            <Col lg="4" className="my-4">
              <div className="text-center">
                <span>
                  <Icon.Headphones size={30} className="text-primary" />
                </span>
                <CardTitle tag="h4" className="my-3">
                  Support
                </CardTitle>
                <CardSubtitle className="text-muted px-3">
                  Get access to premium customer support from the actual people who have created.
                </CardSubtitle>
              </div>
            </Col>
          </Row>
        </ComponentCard>
      </Col>
    </Row>
  );
};

export default About;
