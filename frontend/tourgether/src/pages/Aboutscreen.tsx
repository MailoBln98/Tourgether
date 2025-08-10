export function AboutScreen() {
    return (
        <main className="flex-grow-1">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        <h1 className="text-center mb-5">About Tourgether</h1>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <h2 className="h3 mb-3">Our Mission</h2>
                                <p className="lead">
                                    Tourgether is an inclusive social network that brings motorcycle enthusiasts 
                                    together to discover, share, and experience amazing rides across the world.
                                </p>
                                
                                <p>
                                    We believe that the joy of motorcycling is best when shared. Whether you're a 
                                    seasoned rider or just starting your journey, Tourgether provides a welcoming 
                                    platform to connect with fellow bikers, explore new routes, and create 
                                    unforgettable memories on the open road.
                                </p>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-6">
                                <h3 className="h4 mb-3">What We Offer</h3>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="fas fa-route text-primary me-2"></i>
                                        <strong>Route Sharing:</strong> Upload and discover scenic motorcycle routes
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-users text-primary me-2"></i>
                                        <strong>Community:</strong> Connect with riders from all backgrounds and skill levels
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-calendar-alt text-primary me-2"></i>
                                        <strong>Group Rides:</strong> Join organized tours and meet-ups
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-map-marked-alt text-primary me-2"></i>
                                        <strong>Interactive Maps:</strong> Visualize routes with detailed GPX data
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="col-md-6">
                                <h3 className="h4 mb-3">Why Choose Tourgether</h3>
                                <p>
                                    Motorcycling is more than just transportation – it's a lifestyle, a passion, 
                                    and a community. Tourgether celebrates this spirit by providing:
                                </p>
                                <ul>
                                    <li>A safe and inclusive environment for all riders</li>
                                    <li>Easy-to-use tools for route planning and sharing</li>
                                    <li>Opportunities to discover hidden gems and scenic routes</li>
                                    <li>A platform to share experiences and riding tips</li>
                                    <li>Connection with local and international riding communities</li>
                                </ul>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-12">
                                <div className="bg-light p-4 rounded">
                                    <h3 className="h4 mb-3">Join Our Community</h3>
                                    <p>
                                        Ready to explore new horizons? Create your account and start sharing your 
                                        favorite routes today! Upload GPX files from your rides, join exciting 
                                        group tours, and connect with riders who share your passion for the open road.
                                    </p>
                                    <p className="mb-0">
                                        <strong>All riders welcome – from weekend warriors to daily commuters!</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-12">
                                <h3 className="h4 mb-3">Technology & Safety</h3>
                                <p>
                                    Tourgether uses modern web technologies to provide a seamless experience 
                                    across all devices. We prioritize your privacy and safety, ensuring that 
                                    your personal information is protected while you explore and connect with 
                                    the motorcycle community.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <p className="text-muted">
                                <i className="fas fa-motorcycle me-2"></i>
                                Ride together, explore together – Tourgether
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}