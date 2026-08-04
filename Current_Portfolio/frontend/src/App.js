import React, { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import HeroScene from './components/scene/HeroScene';
import SectionSelector from './components/scene/SectionSelector';
import usePageFlip from './hooks/usePageFlip';
import { Toaster } from './components/ui/toaster';
import './index.css';

const loadBookLayout = () => import('./components/book/BookLayout');
const loadAboutPage = () => import('./components/pages/AboutPage');
const loadExperiencePage = () => import('./components/pages/ExperiencePage');
const loadProjectsPage = () => import('./components/pages/ProjectsPage');
const loadToolkitPage = () => import('./components/pages/ToolkitPage');
const loadCredentialsPage = () => import('./components/pages/CredentialsPage');
const loadContactPage = () => import('./components/pages/ContactPage');

const BookLayout = lazy(loadBookLayout);
const AboutPage = lazy(loadAboutPage);
const ExperiencePage = lazy(loadExperiencePage);
const ProjectsPage = lazy(loadProjectsPage);
const ToolkitPage = lazy(loadToolkitPage);
const CredentialsPage = lazy(loadCredentialsPage);
const ContactPage = lazy(loadContactPage);

const preloadPortfolio = () => Promise.all([
  loadBookLayout(),
  loadAboutPage(),
]);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('BookLayout crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#161927', fontFamily: 'DM Sans, sans-serif' }}>
          <h2 style={{ color: '#c00', marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, background: '#f5f5f5', padding: 16 }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 16, padding: '8px 16px', background: '#2C4A72', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BookLoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-page px-6 text-center">
      <div>
        <div className="mx-auto mb-4 h-px w-20 bg-gold" />
        <p className="font-display text-2xl text-navy">Opening the portfolio</p>
        <p className="mt-2 font-body text-xs uppercase tracking-[0.2em] text-navy/45">Preparing the first chapter</p>
      </div>
    </div>
  );
}

function App() {
  const [scene, setScene] = useState('hero'); // 'hero' | 'book'
  const pageFlip = usePageFlip();

  // Toggle scroll-mode class on <html> based on scene
  useEffect(() => {
    const html = document.documentElement;
    if (scene === 'hero') {
      html.classList.add('scroll-mode');
    } else {
      html.classList.remove('scroll-mode');
      // Scroll back to top when returning to hero
      window.scrollTo(0, 0);
    }
    return () => html.classList.remove('scroll-mode');
  }, [scene]);

  const handleOpenBook = useCallback((pageIndex) => {
    void preloadPortfolio();
    setScene('book');
    // Navigate to specific page after entering book mode
    if (typeof pageIndex === 'number' && pageIndex > 0) {
      // Small delay to let the book render before navigating
      setTimeout(() => {
        pageFlip.goToPage(pageIndex);
      }, 100);
    }
  }, [pageFlip]);

  const handleCloseBook = useCallback(() => {
    setScene('hero');
  }, []);

  const handleSelectSection = useCallback((pageIndex) => {
    handleOpenBook(pageIndex);
  }, [handleOpenBook]);

  return (
    <div className="w-full h-full bg-page app-wrapper">
      {scene === 'hero' && (
        <>
          <HeroScene
            onOpenBook={() => handleOpenBook(0)}
            onWarmBook={preloadPortfolio}
          />
          <SectionSelector onSelectSection={handleSelectSection} />
        </>
      )}

      {scene === 'book' && (
        <ErrorBoundary>
          <Suspense fallback={<BookLoadingState />}>
            <BookLayout
              {...pageFlip}
              onCloseBook={handleCloseBook}
            >
              <AboutPage />
              <ExperiencePage />
              <ProjectsPage />
              <ToolkitPage />
              <CredentialsPage />
              <ContactPage />
            </BookLayout>
          </Suspense>
        </ErrorBoundary>
      )}

      <Toaster />
    </div>
  );
}

export default App;
