import React from "react";
import "./Home.css";

function Home() {
    return (
        <div className="home-container">
            <section className="hero-section">
            </section>
            <section className="features-section">
                <div className="feature-box">
                    <h2 className="feature-heading">Destinations</h2>
                    <p className="feature-description">Search Destinations Around the World.</p>
                </div>
                <div className="feature-box">
                    <h2 className="feature-heading">Trips</h2>
                    <p className="feature-description">Plan out all your future trips!</p>
                </div>
                <div className="feature-box">
                    <h2 className="feature-heading">Activities</h2>
                    <p className="feature-description">Search through different activities in different locations.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;
