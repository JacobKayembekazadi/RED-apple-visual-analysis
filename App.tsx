import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChartData, ChartOptions, DevelopmentArea } from './types';
import {
  CHART_COLORS,
  DEVELOPMENT_AREAS,
  SCRIPTING_IMPACT_CHART_DATA,
  SCRIPTING_IMPACT_CHART_OPTIONS,
  CLIENT_GROWTH_CHART_DATA,
  CLIENT_GROWTH_CHART_OPTIONS,
} from './constants';
import { generateText } from './services/openrouterService';
import Spinner from './components/Spinner';
import Modal from './components/Modal';
import { marked } from 'marked';

// Chart.js specific imports if needed for tree-shaking with a bundler,
// but with CDN, Chart object is globally available.
// import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, LineElement, PointElement, Filler } from 'chart.js';
// Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, LineElement, PointElement, Filler);


const App: React.FC = () => {
  const [scenarioInput, setScenarioInput] = useState<string>('');
  const [scriptOutput, setScriptOutput] = useState<string>('');
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState<boolean>(false);
  const [activeStrategyArea, setActiveStrategyArea] = useState<string | null>(null);

  const scriptingImpactChartRef = useRef<HTMLCanvasElement>(null);
  const clientGrowthChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<{ [key: string]: any }>({});


  const initializeChart = useCallback((canvasRef: React.RefObject<HTMLCanvasElement>, chartId: string, type: string, data: ChartData, options: ChartOptions) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeChart]);


  const handleGenerateScript = async () => {
    if (!scenarioInput.trim()) {
      setScriptOutput('<p class="text-red-500">Please enter a client scenario first.</p>');
      return;
    }
    setIsGeneratingScript(true);
    setScriptOutput(''); // Clear previous output

    const prompt = `You are an expert business coach in the style of Mary-Anne Gillespie, a world-champion athlete known for a 'tough but fair' and 'no excuses' coaching philosophy with Red Apple Coaching. Mary-Anne is known for her blunt but effective approach that challenges real estate professionals to reach their full potential.

A real estate professional presents the following scenario: "${scenarioInput}"

Create a structured coaching script following this precise format:

## 💫 Initial Connection
Begin with a brief, empathetic acknowledgment of their situation (2-3 sentences). Show that you understand their situation but maintain a professional tone.

## 🔍 Reality Check
Deliver a direct, firm challenge to their current mindset that pushes them to reconsider their perspective (2-3 sentences). This should be blunt but constructive - the "tough love" that Mary-Anne is known for.

## 📊 Strategic Analysis
Provide 4 bullet points that:
* Identify the core issue or opportunity they're facing
* Highlight a key mindset shift needed to overcome this challenge
* Point out potential blind spots they may not be seeing
* Emphasize a key strength they possess that they're currently overlooking

## 🚀 Action Plan
Provide 3 specific, actionable steps in order of priority:
1. An immediate action they can take within 24 hours (be specific about what and how)
2. A medium-term strategic adjustment for the next 7-14 days
3. A longer-term habit or practice to build sustainable success over the next 30-90 days

## ⚡ Motivational Close
End with 1-2 powerful sentences that inspire immediate action and reinforce their capability to succeed. This should be memorable and impactful.

Use **bold text** for key phrases, important questions, or powerful statements that should stand out.
Be concise but impactful - focus on clarity and actionability. Use strong, direct language that challenges the client to step up.
`;
    
    try {
      const resultText = await generateText(prompt);
      
      // Configure marked for better rendering
      marked.setOptions({
        breaks: true,      // Convert \n to <br>
        gfm: true          // Use GitHub Flavored Markdown
      });
      
      // Use marked for rich markdown parsing
      const formattedResult = marked(resultText);
      
      // Apply enhanced styling classes with visual improvements
      const enhancedResult = formattedResult
        // Headers with icons and better styling
        .replace(/<h2>/g, '<h2 class="text-xl font-bold text-accent-1 mt-6 mb-3 pb-1 border-b border-gray-200">')
        // Lists with better styling
        .replace(/<ul>/g, '<ul class="list-disc pl-5 my-3 space-y-2">')
        .replace(/<ol>/g, '<ol class="list-decimal pl-5 my-3 space-y-2">')
        .replace(/<li>/g, '<li class="ml-2">')
        // Make strong/bold text stand out with accent color
        .replace(/<strong>/g, '<strong class="text-accent-2">')
        // Add section styling
        .replace(/💫 Initial Connection/g, '💫 Initial Connection')
        .replace(/🔍 Reality Check/g, '🔍 Reality Check')
        .replace(/📊 Strategic Analysis/g, '📊 Strategic Analysis')
        .replace(/🚀 Action Plan/g, '🚀 Action Plan')
        .replace(/⚡ Motivational Close/g, '⚡ Motivational Close')
        // Wrap paragraphs in sections with additional styling
        .replace(/<p>(?!<)/g, '<p class="my-2">')
        // Create visually distinct sections
        .replace(/<\/h2>\s*<p/g, '</h2><div class="bg-gray-50 p-3 rounded-md shadow-sm mb-4"><p');
      
      // Close the div tags we added for section backgrounds
      const finalResult = enhancedResult
        .replace(/<\/p>\s*(<h2|<ul|<ol)/g, '</p></div>$1')
        // Make sure the last section has a closing div if it ends with a paragraph
        .replace(/(<\/p>)(?!\s*<)(?!\s*<\/div>)(?!\s*$)/g, '$1</div>');
      
      setScriptOutput(finalResult);
    } catch (error) {
      console.error("Error generating script:", error);
      setScriptOutput('<p class="text-red-500">Error generating coaching script. Please try again.</p>');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateStrategy = async (areaItem: DevelopmentArea) => {
    setActiveStrategyArea(areaItem.area);
    setIsGeneratingStrategy(true);
    setModalTitle(`Strategic Approaches for: ${areaItem.area}`);
    setModalContent(''); // Clear previous content, spinner will be shown by Modal if content is empty
    setIsModalOpen(true);

    const prompt = `You are an expert business strategy consultant for high-end coaching businesses. For Red Apple Coaching, founded by elite athlete Mary-Anne Gillespie, which specializes in real estate coaching, provide 3 innovative and actionable strategies to address the following development area: '${areaItem.area} - ${areaItem.promptText}'.

Structure your response as follows:

## Overview
Start with a brief (2-3 sentences) overview that frames the challenge and its importance to Red Apple Coaching's business growth.

## Strategy 1: [Title]
* Key benefit: What primary advantage this strategy provides
* Implementation: 2-3 specific, actionable steps to execute this strategy
* Timeline: When to expect results (short/medium/long term)

## Strategy 2: [Title]
* Key benefit: What primary advantage this strategy provides
* Implementation: 2-3 specific, actionable steps to execute this strategy
* Timeline: When to expect results (short/medium/long term)

## Strategy 3: [Title]
* Key benefit: What primary advantage this strategy provides
* Implementation: 2-3 specific, actionable steps to execute this strategy
* Timeline: When to expect results (short/medium/long term)

Use **bold text** for key phrases and important concepts.
Be concise, practical, and business-focused.
Use markdown formatting for structure and readability.`;
    
    try {
      const resultText = await generateText(prompt);
      
      // Configure marked for better rendering
      marked.setOptions({
        breaks: true,      // Convert \n to <br>
        gfm: true          // Use GitHub Flavored Markdown
      });
      
      // Use marked for rich markdown parsing
      const formattedResult = marked(resultText);
      
      // Apply enhanced styling classes with visual improvements
      const enhancedResult = formattedResult
        // Headers with better styling
        .replace(/<h2>/g, '<h2 class="text-xl font-bold text-accent-1 mt-5 mb-3 pb-1 border-b border-gray-200">')
        .replace(/<h3>/g, '<h3 class="text-lg font-bold text-accent-2 mt-4 mb-2">')
        // Lists with better styling
        .replace(/<ul>/g, '<ul class="list-disc pl-5 my-3 space-y-2">')
        .replace(/<li>/g, '<li class="ml-2">')
        // Make strong/bold text stand out
        .replace(/<strong>/g, '<strong class="text-accent-1">')
        // Create visually distinct sections for each strategy
        .replace(/<h2>Strategy 1:(.*?)<\/h2>/g, '<div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4"><h2 class="text-lg font-bold text-accent-1">Strategy 1:$1</h2>')
        .replace(/<h2>Strategy 2:(.*?)<\/h2>/g, '<div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4"><h2 class="text-lg font-bold text-accent-1">Strategy 2:$1</h2>')
        .replace(/<h2>Strategy 3:(.*?)<\/h2>/g, '<div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4"><h2 class="text-lg font-bold text-accent-1">Strategy 3:$1</h2>')
        // Make the Overview section stand out
        .replace(/<h2>Overview<\/h2>/g, '<h2 class="text-xl font-bold text-main mb-3">Overview</h2>')
        // Make sure paragraphs have proper spacing
        .replace(/<p>(?!<)/g, '<p class="my-2">');
      
      // Final cleanup - ensure each strategy section is properly closed
      const finalResult = enhancedResult
        .replace(/(<\/ul>\s*<h2|<\/p>\s*<h2|<\/ul>\s*$|<\/p>\s*$)/g, '$1</div>')
        // Ensure the last section has a closing div if needed
        + (enhancedResult.match(/<div class="bg-gray-50 p-4 rounded-lg shadow-sm my-4">/) && !enhancedResult.endsWith('</div>') ? '</div>' : '');
      
      setModalContent(finalResult);
    } catch (error) {
      console.error("Error generating strategy:", error);
      setModalContent('<p class="text-red-500">Error generating strategic approaches. Please try again.</p>');
    } finally {
      setIsGeneratingStrategy(false);
    }
  };
  
  const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-main text-white py-4 px-2 rounded-lg leading-tight shadow-lg">
          Red Apple Coaching: A Visual Analysis
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
          An AI-enhanced infographic distilling the strategy, market position, and impact of Mary-Anne Gillespie's premier coaching firm, based on comprehensive research.
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
      </section>

      {/* Dynamic Playbook Section */}
      <section id="dynamic-playbook" className="mb-16">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-2">The <span className="text-accent-1">Dynamic</span> Playbook ✨</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-6">Leverage AI to generate custom coaching scripts in the signature RAC style. Enter a client scenario below to see it in action.</p>
          <div className="max-w-2xl mx-auto">
            <textarea 
              id="scenario-input" 
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-inner focus:outline-none focus:border-accent-1 transition" 
              rows={3} 
              placeholder="e.g., A top-performing agent is feeling burnt out and considering leaving the industry..."
              value={scenarioInput}
              onChange={(e) => setScenarioInput(e.target.value)}
              disabled={isGeneratingScript}
            />
            <button 
              id="generate-script-btn" 
              className="mt-4 w-full bg-accent-1 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              onClick={handleGenerateScript}
              disabled={isGeneratingScript}
            >
              {isGeneratingScript ? 'Generating...' : 'Generate Coaching Script'}
            </button>
            { (isGeneratingScript || scriptOutput) && (
                <div 
                    id="script-output" 
                    className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left whitespace-pre-wrap min-h-[100px]"
                >
                    {isGeneratingScript ? <Spinner /> : <div dangerouslySetInnerHTML={createMarkup(scriptOutput)} />}
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Strategic Landscape Section */}
      <section id="strategic-landscape">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Strategic <span className="text-accent-1">Landscape</span> & AI Strategy</h2>
          <p className="max-w-3xl mx-auto text-center text-gray-600 mb-8">An analysis of RAC's market position, enhanced with AI-powered strategic brainstorming. Click a button to explore actionable solutions for each development area.</p>
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
              <h3 className="text-2xl font-bold text-blue-800 mb-4">AI-Enhanced Development Areas</h3>
              <ul id="development-areas" className="space-y-4 text-blue-900">
                {DEVELOPMENT_AREAS.map((item) => (
                  <li key={item.area} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="font-bold">💡 {item.area}</span>
                        <p className="text-sm text-gray-600">{item.promptText}</p>
                      </div>
                      <button 
                        className="generate-strategy-btn mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 bg-accent-1 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
                        onClick={() => handleGenerateStrategy(item)}
                        disabled={isGeneratingStrategy && activeStrategyArea === item.area}
                      >
                        {(isGeneratingStrategy && activeStrategyArea === item.area) ? 'Generating...' : 'Generate Strategies ✨'}
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
        {isGeneratingStrategy && !modalContent ? <Spinner /> : <div dangerouslySetInnerHTML={createMarkup(modalContent)} />}
      </Modal>
    </main>
  );
};

export default App;
