import SolutionCard from "./SolutionCard";
import "./CustomSolutionsSection.css";

const CustomSolutionsSection = () => {
    const solutions = [
        {
            id: "earbuds-large",
            image: "/images/earbuds-case.jpg",
            title: "Earbuds",
            isLarge: true,
        },
        {
            id: "headphones",
            image: "/images/headphones.jpg",
            title: "Headphones",
            isLarge: false,
        },
        {
            id: "turntables",
            image: "/images/turntables.jpg",
            title: "Turntables",
            isLarge: false,
        },
        {
            id: "speakers",
            image: "/images/speakers.jpg",
            title: "Speakers",
            isLarge: false,
        },
        {
            id: "earbuds",
            image: "/images/earbuds.jpg",
            title: "Earbuds",
            isLarge: false,
        },
    ];

    return (
        <section className="custom-solutions-section">
            <div className="custom-solutions-container">
                {/* Section Title */}
                <h2 className="custom-solutions-title">
                    <span className="title-gradient">Explore Now</span>
                </h2>
                
                {/* Grid Layout */}
                <div className="custom-solutions-grid">
                    {/* Large Card - Left */}
                    <div className="custom-solutions-large-card">
                        <SolutionCard
                            image={solutions[0].image}
                            title={solutions[0].title}
                            isLarge={true}
                        />
                    </div>

                    {/* Right Side - 2x2 Grid */}
                    <div className="custom-solutions-right-grid">
                        {/* Card 1 */}
                        <SolutionCard
                            image={solutions[1].image}
                            title={solutions[1].title}
                            isLarge={false}
                        />
                        {/* Card 2 */}
                        <SolutionCard
                            image={solutions[2].image}
                            title={solutions[2].title}
                            isLarge={false}
                        />

                        {/* Card 3 - Hidden on small screens */}
                        <SolutionCard
                            image={solutions[3].image}
                            title={solutions[3].title}
                            isLarge={false}
                        />
                        {/* Card 4 - Hidden on small screens */}
                        <SolutionCard
                            image={solutions[4].image}
                            title={solutions[4].title}
                            isLarge={false}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomSolutionsSection;
