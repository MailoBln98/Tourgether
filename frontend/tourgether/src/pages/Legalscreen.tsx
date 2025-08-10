export function LegalScreen() {
    return (
        <main className="flex-grow-1">
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        <h1 className="text-center mb-5">Legal Information</h1>
                        
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="h4 mb-3">
                                    <i className="fas fa-building text-primary me-2"></i>
                                    Company Information
                                </h2>
                                <p className="text-muted mb-3">
                                    Legal information in accordance with Section 5 TMG (Telemediengesetz).
                                </p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <strong>Company:</strong> Tourgether GmbH
                                            </li>
                                            <li className="mb-2">
                                                <strong>Address:</strong> Musterstraße 123<br />
                                                <span className="ms-4">12345 Musterstadt, Germany</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <strong>Phone:</strong> +49 123 4567890
                                            </li>
                                            <li className="mb-2">
                                                <strong>Email:</strong> 
                                                <a href="mailto:info@tourgether.com" className="text-decoration-none ms-1">
                                                    info@tourgether.com
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="h4 mb-3">
                                    <i className="fas fa-shield-alt text-primary me-2"></i>
                                    Privacy Policy
                                </h2>
                                <p>
                                    We take your privacy seriously. Your personal data is processed in accordance 
                                    with the General Data Protection Regulation (GDPR) and other applicable data 
                                    protection laws.
                                </p>
                                <ul>
                                    <li>We only collect data necessary for the operation of our service</li>
                                    <li>Your data is stored securely and never shared with third parties without consent</li>
                                    <li>You have the right to access, modify, or delete your personal data</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="h4 mb-3">
                                    <i className="fas fa-gavel text-primary me-2"></i>
                                    Terms of Service
                                </h2>
                                <p>
                                    By using Tourgether, you agree to the following terms:
                                </p>
                                <ul>
                                    <li>You are responsible for the accuracy of uploaded route information</li>
                                    <li>Respectful behavior towards other community members is required</li>
                                    <li>Uploaded content must not violate any laws or third-party rights</li>
                                    <li>We reserve the right to remove inappropriate content</li>
                                    <li>Use of the platform is at your own risk when participating in rides</li>
                                </ul>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h2 className="h4 mb-3">
                                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                                    Disclaimer
                                </h2>
                                <p>
                                    <strong>Safety Notice:</strong> Motorcycle riding involves inherent risks. 
                                    Users participate in rides and follow routes at their own risk. Always:
                                </p>
                                <ul>
                                    <li>Wear appropriate safety gear</li>
                                    <li>Check weather and road conditions before riding</li>
                                    <li>Ensure your motorcycle is in good working condition</li>
                                    <li>Follow all traffic laws and regulations</li>
                                    <li>Ride within your skill level</li>
                                </ul>
                                <p className="text-muted">
                                    Tourgether is not responsible for accidents, injuries, or damages that may 
                                    occur during rides organized through our platform.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-muted">
                                <small>
                                    Last updated: {new Date().toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </small>
                            </p>
                            <p className="text-muted">
                                <i className="fas fa-motorcycle me-2"></i>
                                Ride safe, ride together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}