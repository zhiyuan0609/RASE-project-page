"use strict";

// Manuscript text and captions; no author or hosting identity belongs here.
window.RASE_CONTENT = {
  abstract: "Although aerial-ground cooperative 3D detection benefits from complementary viewpoints, perception errors and residual spatial misalignment can introduce unreliable features. Cross-view heterogeneity further makes these features difficult to distinguish from valid viewpoint-specific information. When these errors are not accurately identified, unreliable information enters cooperative fusion and contaminates the shared representation, leading to Collaborative Perception Error Accumulation (CPEA) and degraded detection performance. To address this issue, we propose Reliability-Aware Suppression of Error Propagation (RASE), which mitigates error propagation through complementary mechanisms for unreliability estimation, supervision, and feature suppression. First, Cross-View Unreliability Estimation combines local feature matching, cross-view consistency, and observation density to identify potentially unreliable regions while accounting for viewpoint differences. Second, View-Aware Dynamic Loss Weighting adaptively adjusts region-wise supervision according to differences in spatial observability and feature responses, improving unreliability learning under heterogeneous observations. Finally, Reliability-Aware Feature Suppression employs adaptive residual retention to attenuate unreliable feature contributions before fusion while preserving useful complementary information. Experiments on V2U4Real dataset and AirV2X dataset demonstrate the effectiveness of RASE in real-world vehicle-to-UAV and heterogeneous multi-agent cooperative 3D detection. Furthermore, we construct RASE-sim dataset, a small-scale simulated aerial ground cooperative perception dataset, to further evaluate the cross-domain generalization of RASE from simulation to real-world scenarios.",
  figures: [
    {
      src: "assets/figure-1.webp", title: "Collaborative Perception Error Accumulation",
      caption: "Cross-view heterogeneity, perception errors, and spatial misalignment introduce unreliable information that can propagate through cooperative fusion.",
      alt: "Ground and aerial observations illustrating unreliable features and error propagation through cooperative fusion."
    },
    {
      src: "assets/figure-2.webp", title: "RASE framework",
      caption: "RASE combines cross-view unreliability estimation, view-aware dynamic loss weighting, and reliability-aware feature suppression before cooperative fusion.",
      alt: "RASE architecture showing ground and aerial LiDAR encoders, unreliability estimation, suppression, fusion, detection, and training supervision."
    },
    {
      src: "assets/figure-3.webp", title: "Cross-View Unreliability Estimation",
      caption: "Local cross-view matching, feature consistency, and observation density provide complementary cues for estimating potentially unreliable regions.",
      alt: "Unreliability estimation module with feature projection, local cross-view matching, observation density, and feature discrepancy."
    },
    {
      src: "assets/figure-4.webp", title: "View-Aware Dynamic Loss Weighting",
      caption: "Region-wise supervision weights adapt to differences in observation density and projected feature responses across ground and aerial views.",
      alt: "Dynamic loss weighting module producing spatial supervision weights for ground and aerial unreliability learning."
    },
    {
      src: "assets/figure-5.webp", title: "Detection under communication latency",
      caption: "Comparison of detection performance across communication latency settings. The two panels report AP at IoU thresholds of 0.5 and 0.7.",
      alt: "Two plots comparing cooperative detection methods at communication latencies from zero to 500 milliseconds."
    },
    {
      src: "assets/figure-6.webp", title: "Qualitative detection examples",
      caption: "Detection and localization examples for RASE and a baseline, alongside a scene with UGV, UAV, and RSU observations.",
      alt: "Qualitative comparisons of detected and missed objects, localization accuracy, and multi-agent point clouds."
    },
    {
      src: "assets/figure-7.webp", title: "Cooperative detection on AirV2X",
      caption: "Panel (a) compares RASE with Early Fusion, Late Fusion, AttFuse, V2X-ViT, and Where2Comm. Panel (b) compares Where2Comm and RASE with UGV, UAV, and RSU agents.",
      alt: "AirV2X qualitative results comparing six detection methods and two methods with three heterogeneous agents."
    }
  ]
};
