import React from 'react';
import './Impact.css';

// Komponen Ikon SVG
const CoralIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-2 1.5-3 4-3 6 0 2 1 3 3 3s3-1 3-3c0-2-1-4.5-3-6z" />
    <path d="M7 8c-1.5 1.5-2 4-2 6 0 1.5 1 2.5 2.5 2.5S10 15.5 10 14c0-2-.5-4.5-3-6z" />
    <path d="M17 8c-2.5 1.5-3 4-3 6 0 1.5 1 2.5 2.5 2.5S19 15.5 19 14c0-2-.5-4.5-2-6z" />
    <path d="M12 12v6" />
    <path d="M8 21h8" />
  </svg>
);

const ShieldChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M8 10l2 2 4-4" />
    <path d="M14 10l2 2-4 4" />
  </svg>
);

const HandDollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 14h2a2 2 0 100-4h-2a2 2 0 110-4h2" />
    <path d="M12 4v16" />
    <path d="M4 12c0-2.5 1-5 3-6.5C9 3.5 12 3 15 5c2 1.3 3 3.5 3 6s-1 5-3 6.5c-3 2-6 1.5-8 0.5" />
    <path d="M4 12c-1.5 0-2.5 1-2.5 2.5S2.5 17 4 17" />
    <path d="M20 12c1.5 0 2.5 1 2.5 2.5S21.5 17 20 17" />
  </svg>
);

const HealthShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9.5 12h5" />
    <path d="M12 9.5v5" />
  </svg>
);

const CommunityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" />
    <path d="M2.5 20c.8-3 3-5 6.5-5s5.7 2 6.5 5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15.5 15.5c3 .3 5 2 5.5 4.5" />
  </svg>
);

// Data untuk bagian kiri (Impact Icons)
const impactStats = [
  {
    icon: <CoralIcon />,
    value: '125.000+',
    label: 'Coral Fragment Embedded',
  },
  {
    icon: <ShieldChevronIcon />,
    value: '48 Ha',
    label: 'Coral Reef Zone Revitalized',
  },
  {
    icon: <HandDollarIcon />,
    value: 'Rp 10,2 M+',
    label: 'Total Impact Funding Disbursed',
  },
];

// Data untuk bagian kanan (Stat Cards)
const impactDetails = [
  {
    icon: <HealthShieldIcon />,
    title: 'Biodiversity Recovery',
    subtitle: '94% Survival Rate',
    description: 'Pemulihan keanekaragaman hayati laut dengan tingkat kelangsungan hidup bibit karang mencapai 94% dalam 18 bulan pertama.',
  },
  {
    icon: <CommunityIcon />,
    title: 'Coastal Community Empowerment',
    subtitle: '350+ Nelayan Lokal',
    description: 'Pelibatan masyarakat pesisir sebagai teknisi transplantasi karang dan reef guardian berpenghasilan tetap.',
  },
  {
    icon: <HealthShieldIcon />,
    title: 'Verified Carbon & Ocean Credits',
    subtitle: 'ESG Compliance',
    description: 'Pelaporan serapan karbon biru (blue carbon) dan sertifikasi kepatuhan ESG untuk mitra korporasi.',
  },
];

const Impact = () => {
  return (
    <section className="container impact-section">
      <h2 className="section-title">Impact</h2>
      <p>Illustrative impact examples below — these figures are not verified CoralLink results.</p>

      <div className="impact-grid">
        {/* Left side: Intro & Key Metrics */}
        <div className="impact-left">
          <div className="impact-intro">
            <h3>Real Ocean Impact, Measured Transparently</h3>
            <p>
              Kami percaya bahwa kepercayaan lahir dari transparansi. Setiap program restorasi yang terdaftar di CoralLink melalui uji kelayakan ketat (due diligence) dan dipantau secara berkala agar dampak ekologis maupun sosialnya dapat diverifikasi secara real-time.
            </p>
          </div>

          <div className="impact-icons">
            {impactStats.map((stat, index) => (
              <div className="icon-item" key={index}>
                <div className="icon-wrapper">
                  {stat.icon}
                </div>
                <div className="icon-text">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Detailed impact cards */}
        <div className="impact-right">
          {impactDetails.map((detail, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">
                {detail.icon}
              </div>
              <div className="stat-content">
                <h4 className="stat-title">{detail.title}</h4>
                <p className="stat-subtitle">{detail.subtitle}</p>
                <p className="stat-description">{detail.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;