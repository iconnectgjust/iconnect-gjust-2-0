import "./SeedVideo.css";
import "../../ScrollAnimation.css";
import useScrollAnimation from "../../ScrollAnimation";
import React from "react";
import Youtube from "react-youtube-embed";

function SeedVideo() {
    useScrollAnimation();

    return (
        <section className="video">
            <p className="eyebrow">Explanatory Video</p>
            <h2 className="heading reveal slide-left">How to apply for Seed Funding?</h2>
            <Youtube className="reveal fade-up" id="tUqhEgdj5LM" />
        </section>
    )
}

export default SeedVideo;