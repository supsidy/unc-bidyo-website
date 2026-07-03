# UNC BIDYO Sub-Portal — Project Structure

```
src/
├── App.jsx
├── index.css
├── components/
│   ├── Navbar.jsx           # White navbar, logo left
│   ├── HeroBanner.jsx       # Asymmetric dark hero card + gear graphic
│   ├── AboutSection.jsx     # Theatrical split layout (team lineup + copy)
│   ├── OfferCarousel.jsx    # "WHAT WE OFFER" interactive slider
│   └── HighlightsSection.jsx# Bottom gallery/portfolio grid foundation
└── data/
    └── offers.js            # Carousel content (service cards)
```

Page background: the deep crimson → near-black vertical gradient lives on
the root wrapper in `App.jsx` (`bg-gradient-to-b from-[#8c0d22] via-[#5c0a18] to-[#1a0306]`)
so every section sits on a continuous gradient rather than each section
having its own flat background.
