import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Me</h1>
        <p>Welcome to my portfolio!</p>
      </section>

      <section className="about-content">
        <h2>Who I Am</h2>
        <p>
          Add your bio here - tell visitors about your background, skills, and experience.
        </p>

        <h2>What I Do</h2>
        <p>
          Describe your expertise in data analytics, development, or your area of focus.
        </p>

        <h2>Get In Touch</h2>
        <p>
          Add your contact information or links to your social profiles.
        </p>
      </section>
    </div>
  );
};

export default About;
