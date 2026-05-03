'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SolutionCard from "./SolutionCard";
import "./CustomSolutionsSection.css";

interface Solution {
    id: string;
    title: string;
    image_url: string;
    is_large: boolean;
    sort_order: number;
}

const CustomSolutionsSection = () => {
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('explore_sections')
                    .select('id, title, image_url, is_large, sort_order')
                    .order('sort_order', { ascending: true });

                if (error) throw error;
                setSolutions(data || []);
            } catch (error) {
                console.error('Error fetching explore sections:', error);
                setSolutions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    return (
        <section id="explore-now-section" className="custom-solutions-section">
            <div className="custom-solutions-container">
                {/* Section Title */}
                <h2 className="custom-solutions-title">
                    <span className="title-gradient">Explore Now</span>
                </h2>

                {/* Grid Layout */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading sections...</p>
                    </div>
                ) : solutions.length > 0 ? (
                    <div className="custom-solutions-grid">
                        {/* Large Card - Left */}
                        {solutions.find(s => s.is_large) && (
                            <div className="custom-solutions-large-card">
                                <SolutionCard
                                    image={solutions.find(s => s.is_large)?.image_url || '/placeholder.svg'}
                                    title={solutions.find(s => s.is_large)?.title || ''}
                                    isLarge={true}
                                />
                            </div>
                        )}

                        {/* Right Side - 2x2 Grid */}
                        <div className="custom-solutions-right-grid">
                            {solutions.filter(s => !s.is_large).slice(0, 4).map((solution) => (
                                <SolutionCard
                                    key={solution.id}
                                    image={solution.image_url || '/placeholder.svg'}
                                    title={solution.title}
                                    isLarge={false}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No sections available</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CustomSolutionsSection;
