import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChartData, ChartOptions, DevelopmentArea } from './types';
import {
  DEVELOPMENT_AREAS,
  SCRIPTING_IMPACT_CHART_DATA,
  SCRIPTING_IMPACT_CHART_OPTIONS,
  CLIENT_GROWTH_CHART_DATA,
  CLIENT_GROWTH_CHART_OPTIONS,
} from './constants';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');

  const scriptingImpactChartRef = useRef<HTMLCanvasElement>(null);
  const clientGrowthChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ [key: string]: any }>({});
  const initializeChart = useCallback((canvasRef: React.RefObject<HTMLCanvasElement | null>, chartId: string, type: string, data: ChartData, options: ChartOptions) => {
    if (canvasRef.current && (window as any).Chart) {
      if (chartInstancesRef.current[chartId]) {
        chartInstancesRef.current[chartId].destroy();
      }
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        chartInstancesRef.current[chartId] = new (window as any).Chart(ctx, {
          type: type,
          data: data,
          options: options,
        });
      }
    }
  }, []);

  useEffect(() => {
    initializeChart(scriptingImpactChartRef, 'scriptingImpactChart', 'bar', SCRIPTING_IMPACT_CHART_DATA, SCRIPTING_IMPACT_CHART_OPTIONS);
    initializeChart(clientGrowthChartRef, 'clientGrowthChart', 'line', CLIENT_GROWTH_CHART_DATA, CLIENT_GROWTH_CHART_OPTIONS);

    return () => {
      Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
    };
  }, [initializeChart]);

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  const handleOpenStrategyModal = (areaItem: DevelopmentArea) => {
    setModalTitle(`Strategic Approaches for: ${areaItem.area}`);
    
    // Static content instead of AI-generated content
    let staticContent = '';
    
    switch(areaItem.area) {
      case 'Scalability':
        staticContent = `
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 1: Implement Tiered Coaching Programs</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Allows Mary-Anne to reach more clients while maintaining quality</li>
              <li><strong class="text-accent-1">Implementation:</strong> Create bronze/silver/gold tiers with varying levels of direct access</li>
              <li><strong class="text-accent-1">Timeline:</strong> Medium term (6-12 months)</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 2: Train Certified RAC Coaches</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Extends Mary-Anne's methodology through trusted partners</li>
              <li><strong class="text-accent-1">Implementation:</strong> Develop certification program and trainer network</li>
              <li><strong class="text-accent-1">Timeline:</strong> Long term (12-24 months)</li>
            </ul>
          </div>
        `;
        break;
      case 'Claim Substantiation':
        staticContent = `
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 1: Client Success Tracking System</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Provides measurable proof of coaching effectiveness</li>
              <li><strong class="text-accent-1">Implementation:</strong> Implement CRM with before/after metrics tracking</li>
              <li><strong class="text-accent-1">Timeline:</strong> Short term (3-6 months)</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 2: Third-Party Validation</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Independent verification builds credibility</li>
              <li><strong class="text-accent-1">Implementation:</strong> Partner with real estate associations for outcome studies</li>
              <li><strong class="text-accent-1">Timeline:</strong> Medium term (6-12 months)</li>
            </ul>
          </div>
        `;
        break;
      case 'Broader Market Visibility':
        staticContent = `
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 1: Multi-Industry Content Strategy</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Demonstrates coaching versatility beyond real estate</li>
              <li><strong class="text-accent-1">Implementation:</strong> Create case studies from different industries</li>
              <li><strong class="text-accent-1">Timeline:</strong> Medium term (6-9 months)</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 2: Strategic Partnership Network</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Expands reach through complementary service providers</li>
              <li><strong class="text-accent-1">Implementation:</strong> Partner with business consultants in different sectors</li>
              <li><strong class="text-accent-1">Timeline:</strong> Long term (12-18 months)</li>
            </ul>
          </div>
        `;
        break;
      case 'Long-Term Data':
        staticContent = `
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 1: Alumni Success Program</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Creates ongoing relationships for long-term tracking</li>
              <li><strong class="text-accent-1">Implementation:</strong> Establish alumni network with annual check-ins</li>
              <li><strong class="text-accent-1">Timeline:</strong> Short term (3-6 months to start)</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">
            <h2 class="text-lg font-bold text-accent-1">Strategy 2: Longitudinal Impact Study</h2>
            <ul class="list-disc pl-5 my-3 space-y-2">
              <li><strong class="text-accent-1">Key benefit:</strong> Provides compelling evidence of sustained coaching impact</li>
              <li><strong class="text-accent-1">Implementation:</strong> Partner with academic institution for formal study</li>
              <li><strong class="text-accent-1">Timeline:</strong> Long term (18-36 months)</li>
            </ul>
          </div>
        `;
        break;
      default:
        staticContent = `
          <p class="text-gray-600">Strategic recommendations for this development area are being refined. Please check back later for detailed approaches.</p>
        `;
    }
    
    setModalContent(staticContent);
    setIsModalOpen(true);
  };

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-main text-white py-4 px-2 rounded-lg leading-tight shadow-lg">
          Red Apple Coaching: A Visual Analysis
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
          An interactive infographic distilling the strategy, market position, and impact of Mary-Anne Gillespie's premier coaching firm, based on comprehensive research.
        </p>
      </header>

      {/* MAG Factor Section */}
      <section id="mag-factor" className="mb-16">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-2">The <span className="text-accent-1">MAG</span> Factor: The Driving Force</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            The foundation of Red Apple Coaching is its founder, Mary-Anne Gillespie. Her extensive experience and remarkable achievements establish a unique level of authority and credibility in the coaching industry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner"><p className="text-5xl font-extrabold text-accent-2">32,000+</p><p className="mt-2 font-semibold text-gray-700">Hours of Billable Coaching</p></div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner"><p className="text-5xl font-extrabold text-accent-2">270+</p><p className="mt-2 font-semibold text-gray-700">Verified 7-Figure Agents Coached</p></div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner"><p className="text-5xl font-extrabold text-accent-2">700+</p><p className="mt-2 font-semibold text-gray-700">Business Owners Served</p></div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner"><p className="text-5xl font-extrabold text-accent-2">#1</p><p className="mt-2 font-semibold text-gray-700">Authored Canada's Top Real Estate Course</p></div>
          </div>
        </div>
      </section>

      {/* RAC Method Section */}
      <section id="rac-method" className="mb-16">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-2">The <span className="text-accent-1">RAC</span> Method: From Philosophy to Results</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-10">
            RAC's value proposition is a structured process that translates Mary-Anne's "Anything is Possible" philosophy into tangible client outcomes through a systematic, action-oriented framework.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <div className="p-4 bg-accent-1-light rounded-lg shadow-md text-center w-full md:w-auto"><h3 className="font-bold text-accent-1 text-lg">Personal Philosophy</h3><p className="text-sm">Resilience & Peak Performance</p></div>
            <div className="text-2xl font-bold text-accent-1 mx-4 hidden md:block">&rarr;</div><div className="text-2xl font-bold text-accent-1 my-2 md:hidden">&darr;</div>
            <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-md text-center w-full md:w-auto"><h3 className="font-bold text-gray-700 text-lg">Proven Systems</h3><p className="text-sm">Replicable processes for growth</p></div>
            <div className="text-2xl font-bold text-gray-400 mx-4 hidden md:block">&rarr;</div><div className="text-2xl font-bold text-gray-400 my-2 md:hidden">&darr;</div>
            <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-md text-center w-full md:w-auto"><h3 className="font-bold text-gray-700 text-lg">Custom Scripts</h3><p className="text-sm">Market-tested communication tools</p></div>
            <div className="text-2xl font-bold text-gray-400 mx-4 hidden md:block">&rarr;</div><div className="text-2xl font-bold text-gray-400 my-2 md:hidden">&darr;</div>
            <div className="p-4 bg-main text-white rounded-lg shadow-md text-center w-full md:w-auto"><h3 className="font-bold text-accent-3 text-lg">Tangible Results</h3><p className="text-sm text-gray-200">Financial & Personal Growth</p></div>
          </div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section id="proven-results" className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">The Impact of <span className="text-accent-1">Scripting</span></h2>
            <p className="text-center text-gray-600 mb-8">RAC's scripting coaching is positioned as a key driver of financial success, with claims of significant, quantifiable improvements in core sales metrics.</p>
            <div className="chart-container"><canvas ref={scriptingImpactChartRef}></canvas></div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">Client Growth <span className="text-accent-1">Trajectory</span></h2>
            <p className="text-center text-gray-600 mb-8">Testimonials highlight dramatic financial transformations. This chart visualizes the reported journey of a client from $80k to $600k GCI after implementing RAC's business planning.</p>
            <div className="chart-container"><canvas ref={clientGrowthChartRef}></canvas></div>
          </div>
        </div>
      </section>      {/* Coaching Excellence Section */}
      <section id="coaching-excellence" className="mb-16">
        <div className="bg-gradient-to-br from-white via-gray-50 to-accent-1-light p-8 rounded-lg shadow-xl text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-accent-1"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-accent-2"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Coaching <span className="text-accent-1">Excellence</span> Framework</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-12 leading-relaxed">
              Red Apple Coaching's approach combines Mary-Anne's athletic mindset with proven business strategies to deliver 
              <span className="font-semibold text-accent-1"> transformational results</span> for real estate professionals.
            </p>
            
            {/* Core Principles Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                
                {/* Mindset Transformation Card */}
                <div className="group bg-white p-8 rounded-xl shadow-lg border-l-4 border-accent-1 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-1 to-accent-2 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      💫
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-gray-800 mb-1">Mindset Transformation</h4>
                      <p className="text-accent-1 font-medium">Foundation of Success</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-left">Shifting from limitation to possibility thinking through proven psychological frameworks</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-1 rounded-full mr-3"></span>Overcoming self-imposed barriers</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-1 rounded-full mr-3"></span>Building resilience and confidence</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-1 rounded-full mr-3"></span>Developing a growth mindset</li>
                    </ul>
                  </div>
                </div>

                {/* Strategic Implementation Card */}
                <div className="group bg-white p-8 rounded-xl shadow-lg border-l-4 border-accent-2 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-2 to-accent-3 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      📊
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-gray-800 mb-1">Strategic Implementation</h4>
                      <p className="text-accent-2 font-medium">Systems & Processes</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-left">Proven systems and actionable strategies that translate goals into measurable outcomes</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-2 rounded-full mr-3"></span>Business planning and goal setting</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-2 rounded-full mr-3"></span>Sales process optimization</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-2 rounded-full mr-3"></span>Client relationship management</li>
                    </ul>
                  </div>
                </div>

                {/* Performance Acceleration Card */}
                <div className="group bg-white p-8 rounded-xl shadow-lg border-l-4 border-accent-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-3 to-main rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      🚀
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-gray-800 mb-1">Performance Acceleration</h4>
                      <p className="text-accent-3 font-medium">Rapid Growth</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-left">Fast-tracking professional growth through targeted skill development and optimization</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-3 rounded-full mr-3"></span>Skill development and mastery</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-3 rounded-full mr-3"></span>Productivity enhancement</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-accent-3 rounded-full mr-3"></span>Time and energy management</li>
                    </ul>
                  </div>
                </div>

                {/* Results-Focused Accountability Card */}
                <div className="group bg-white p-8 rounded-xl shadow-lg border-l-4 border-main hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-main to-gray-800 rounded-full flex items-center justify-center text-2xl mr-4 text-white group-hover:scale-110 transition-transform duration-300">
                      ⚡
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-gray-800 mb-1">Results-Focused Accountability</h4>
                      <p className="text-main font-medium">Sustained Success</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-left">Ensuring consistent progress and outcomes through structured accountability systems</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                      <li className="flex items-center"><span className="w-2 h-2 bg-main rounded-full mr-3"></span>Regular progress tracking</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-main rounded-full mr-3"></span>Milestone celebrations</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-main rounded-full mr-3"></span>Continuous improvement</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Success Path Visualization */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">The RAC Success Journey</h3>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                      1
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Assessment</h4>
                    <p className="text-sm text-gray-600">Comprehensive evaluation of current performance and potential</p>
                  </div>
                  <div className="hidden md:block text-3xl text-gray-400">→</div>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                      2
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Strategy</h4>
                    <p className="text-sm text-gray-600">Customized action plan based on individual goals and challenges</p>
                  </div>
                  <div className="hidden md:block text-3xl text-gray-400">→</div>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                      3
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Implementation</h4>
                    <p className="text-sm text-gray-600">Guided execution with ongoing support and adjustments</p>
                  </div>
                  <div className="hidden md:block text-3xl text-gray-400">→</div>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                      4
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Results</h4>
                    <p className="text-sm text-gray-600">Measurable outcomes and sustained growth achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Landscape Section */}
      <section id="strategic-landscape">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Strategic <span className="text-accent-1">Landscape</span> & Development Areas</h2>
          <p className="max-w-3xl mx-auto text-center text-gray-600 mb-8">An analysis of RAC's market position with strategic recommendations for continued growth. Click the buttons below to explore actionable solutions for each development area.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Core Strengths</h3>
              <ul className="space-y-2 list-inside text-green-900">
                <li className="flex items-start"><span className="mr-2 mt-1">&#10003;</span><div><strong>Founder's Powerful Brand:</strong> A unique story of resilience and achievement.</div></li>
                <li className="flex items-start"><span className="mr-2 mt-1">&#10003;</span><div><strong>Deep Real Estate Niche:</strong> Highly specialized, tailored expertise.</div></li>
                <li className="flex items-start"><span className="mr-2 mt-1">&#10003;</span><div><strong>Results-Oriented:</strong> Strong focus on tangible financial outcomes.</div></li>
                <li className="flex items-start"><span className="mr-2 mt-1">&#10003;</span><div><strong>Proprietary Content:</strong> Exclusive access to proven systems and scripts.</div></li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Development Areas</h3>
              <ul id="development-areas" className="space-y-4 text-blue-900">
                {DEVELOPMENT_AREAS.map((item) => (
                  <li key={item.area} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="font-bold">💡 {item.area}</span>
                        <p className="text-sm text-gray-600">{item.promptText}</p>
                      </div>
                      <button 
                        className="generate-strategy-btn mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 bg-accent-1 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
                        onClick={() => handleOpenStrategyModal(item)}
                      >
                        View Strategies
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
      >
        <div dangerouslySetInnerHTML={createMarkup(modalContent)} />
      </Modal>
    </main>
  );
};

export default App;
