import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Percent, Settings, ChevronDown, ChevronUp, Globe, Download, AlertCircle, CheckCircle } from 'lucide-react';

// Financial calculations
const calculateNPV = (cashFlows, rate) => {
  return cashFlows.reduce((npv, cf, year) => 
    npv + cf.amount / Math.pow(1 + rate, year), 0);
};

const calculateIRR = (cashFlows) => {
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    let npv = 0, derivative = 0;
    cashFlows.forEach((cf, year) => {
      npv += cf.amount / Math.pow(1 + rate, year);
      derivative -= (year * cf.amount) / Math.pow(1 + rate, year + 1);
    });
    if (Math.abs(npv) < 0.0001) return rate;
    rate = rate - npv / derivative;
  }
  return rate;
};

const calculateMIRR = (cashFlows, financeRate, reinvestRate) => {
  let pv = 0, fv = 0;
  const n = cashFlows.length - 1;
  
  cashFlows.forEach((cf, year) => {
    if (cf.amount < 0) {
      pv += cf.amount / Math.pow(1 + financeRate, year);
    } else {
      fv += cf.amount * Math.pow(1 + reinvestRate, n - year);
    }
  });
  
  if (pv === 0) return 0;
  return Math.pow(-fv / pv, 1 / n) - 1;
};

const calculatePayback = (cashFlows) => {
  let cumulative = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulative += cashFlows[i].amount;
    if (cumulative >= 0) {
      const prevCum = cumulative - cashFlows[i].amount;
      return i - 1 + Math.abs(prevCum) / cashFlows[i].amount;
    }
  }
  return null;
};

const formatCurrency = (amount, currency = 'USD') => {
  const symbol = currency === 'USD' ? '$' : 'KES ';
  return `${symbol}${(amount / 1000000).toFixed(2)}M`;
};

// Collapsible section component
const CollapsibleSection = ({ title, isOpen, onToggle, children, badge, completionPct }) => (
  <div style={{ marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '16px 20px',
        background: isOpen ? '#f8fafc' : 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: '600',
        color: '#0f172a',
        transition: 'background 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{title}</span>
        {badge && (
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '500', 
            padding: '2px 8px', 
            background: '#dbeafe', 
            color: '#1e40af',
            borderRadius: '12px'
          }}>
            {badge}
          </span>
        )}
        {completionPct !== undefined && (
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            padding: '2px 8px',
            background: completionPct === 100 ? '#dcfce7' : completionPct >= 50 ? '#fef3c7' : '#fee2e2',
            color: completionPct === 100 ? '#166534' : completionPct >= 50 ? '#92400e' : '#991b1b',
            borderRadius: '12px'
          }}>
            {completionPct}% complete
          </span>
        )}
      </div>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div style={{ padding: '24px', background: 'white' }}>
        {children}
      </div>
    )}
  </div>
);

// Input field component
const InputField = ({ label, value, onChange, type = "number", suffix, min, max, step = "any", helpText, disabled = false, required = false, options = null }) => {
  const isEmpty = required && (value === null || value === undefined || value === '' || value === 0);
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '500', 
        marginBottom: '6px', 
        color: isEmpty ? '#dc2626' : '#475569'
      }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {options ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              border: isEmpty ? '2px solid #dc2626' : '1px solid #e2e8f0',
              borderRadius: '8px', 
              fontSize: '14px',
              background: disabled ? '#f1f5f9' : 'white',
              color: disabled ? '#64748b' : '#0f172a'
            }}
          >
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : type === 'date' ? (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ 
              width: '100%', 
              padding: '10px 12px',
              border: isEmpty ? '2px solid #dc2626' : '1px solid #e2e8f0',
              borderRadius: '8px', 
              fontSize: '14px',
              background: disabled ? '#f1f5f9' : 'white',
              color: disabled ? '#64748b' : '#0f172a'
            }}
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              paddingRight: suffix ? '60px' : '12px',
              border: isEmpty ? '2px solid #dc2626' : '1px solid #e2e8f0',
              borderRadius: '8px', 
              fontSize: '14px',
              background: disabled ? '#f1f5f9' : 'white',
              color: disabled ? '#64748b' : '#0f172a'
            }}
          />
        )}
        {suffix && (
          <span style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#64748b', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {suffix}
          </span>
        )}
      </div>
      {isEmpty && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>Required field</p>}
      {helpText && !isEmpty && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{helpText}</p>}
    </div>
  );
};

// Create initial project
const createProject = () => ({
  id: 1,
  name: 'PROJECT 1',
  
  // GENERAL (3 fields)
  businessUnit: '',
  descriptionLabel: '',
  fsRevenueMapping: '',
  
  // TIMING (5 fields)
  constructionYear: 2027,
  constructionMonth: 7,
  monthsConstruction: 18,
  operationalPrepMonths: 2,
  monthsToStabilized: 36,
  
  // CAPITAL (4 fields)
  dateOfCapitalCostEstimate: '2026-02-01',
  constructionOutlay: 0,
  softCostPercentage: 0,
  escalation: 0,
  
  // PHILANTHROPY CAPITAL (17 fields)
  philanthropyGoal: 0.8,
  friendsOfKijabe: 0,
  kijabeHospital: 0,
  samaritanPurse: 0,
  pppMRI: 0,
  additionalNeed: 0,
  africanMissionHealthcare: 0,
  cure: 0,
  medicalBenevolence: 0,
  notUsed1: 0,
  notUsed2: 0,
  notUsed3: 0,
  notUsed4: 0,
  unaccountedPartner: 0,
  dateCampaignStart: '2027-01-01',
  campaignMonths: 18,
  levelOfCampaignAchieved: 1.0,
  
  // PHILANTHROPY OPERATIONS (1 field)
  targetedAnnualContributions: 0.1,
  
  // OPERATIONAL (14 fields)
  businessUnitTotalCapacity: 0,
  netPatientRevenue: 0,
  otherRevenue: 0,
  laborAtCapacity: 0,
  suppliesAtCapacity: 0,
  adminAtCapacity: 0,
  useExpenseOverride: false,
  expenseOverride: 0,
  donatedLaborAtCapacity: 0,
  targetedOperationalLevel: 0.8,
  revenueIncrease: 0.04,
  expenseInflationLabor: 0.05,
  expenseInflationNonLabor: 0.04,
  expenseInflationOverride: 0.045,
  investmentIncomeRate: 0.04
});

function App() {
  const [project, setProject] = useState(createProject());
  const [activeTab, setActiveTab] = useState('overview');
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  
  // Global settings - moved from per-project
  const [globalSettings, setGlobalSettings] = useState({
    discountRate: 0.08,
    reinvestmentRate: 0.08,
    financeRate: 0.05,
    exchangeRate: 130,
    // These come from project but will be global in multi-project version
    revenueIncrease: 0.04,
    expenseInflationLabor: 0.05,
    expenseInflationNonLabor: 0.04,
    expenseInflationOverride: 0.045,
    investmentIncomeRate: 0.04
  });
  
  const [sectionsOpen, setSectionsOpen] = useState({
    general: true,
    timing: true,
    capital: true,
    philanthropyCapital: false,
    philanthropyOps: false,
    operational: true
  });
  
  const toggleSection = (section) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const updateProject = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      'businessUnit', 'descriptionLabel', 'constructionYear', 'constructionMonth',
      'monthsConstruction', 'constructionOutlay', 'monthsToStabilized',
      'targetedOperationalLevel'
    ];
    
    // Add conditional required fields
    if (project.useExpenseOverride) {
      requiredFields.push('expenseOverride');
    } else {
      requiredFields.push('laborAtCapacity', 'suppliesAtCapacity', 'adminAtCapacity');
    }
    
    // Must have at least one revenue source
    const hasRevenue = project.netPatientRevenue > 0 || project.otherRevenue > 0;
    
    const filled = requiredFields.filter(field => {
      const value = project[field];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    });
    
    const pct = Math.round((filled.length / requiredFields.length) * 100);
    return { pct, hasRevenue, total: requiredFields.length, filled: filled.length };
  };
  
  const completion = calculateCompletion();
  
  // Financial calculations
  const financialMetrics = useMemo(() => {
    const monthsEscalation = 17;
    const escalationFactor = Math.pow(1 + project.escalation, monthsEscalation / 12);
    const escalatedConstruction = project.constructionOutlay * escalationFactor;
    const softCosts = escalatedConstruction * project.softCostPercentage;
    const totalCost = escalatedConstruction + softCosts;
    
    const philanthropyTotal = 
      project.friendsOfKijabe + project.kijabeHospital + project.samaritanPurse +
      project.pppMRI + project.additionalNeed + project.africanMissionHealthcare +
      project.cure + project.medicalBenevolence + project.unaccountedPartner;
    
    const philanthropyTarget = totalCost * project.philanthropyGoal;
    const philanthropyPlug = Math.max(0, philanthropyTarget - philanthropyTotal);
    const equityNeeded = Math.max(0, totalCost - philanthropyTotal - philanthropyPlug);
    
    const cashFlows = [{ year: 0, amount: -totalCost, label: project.constructionYear.toString() }];
    
    let stabilizedRevenue = 0;
    let stabilizedExpense = 0;
    
    for (let year = 1; year <= 10; year++) {
      const operationalYear = year - 2;
      
      if (operationalYear > 0) {
        const rampUpFactor = Math.min(1, operationalYear / (project.monthsToStabilized / 12));
        
        const baseRevenue = project.netPatientRevenue * project.targetedOperationalLevel * rampUpFactor;
        const baseOtherRevenue = project.otherRevenue * rampUpFactor;
        const donatedLabor = project.donatedLaborAtCapacity * rampUpFactor;
        
        const revenue = (baseRevenue + baseOtherRevenue) * Math.pow(1 + globalSettings.revenueIncrease, operationalYear);
        const revenueWithDonated = revenue + donatedLabor;
        
        let expense;
        if (project.useExpenseOverride) {
          expense = project.expenseOverride * rampUpFactor * 
                   Math.pow(1 + globalSettings.expenseInflationOverride, operationalYear);
        } else {
          const baseExpense = (
            project.laborAtCapacity +
            project.suppliesAtCapacity +
            project.adminAtCapacity
          ) * rampUpFactor;
          expense = baseExpense * Math.pow(1 + globalSettings.expenseInflationNonLabor, operationalYear);
        }
        
        const expenseWithDonated = expense + donatedLabor;
        
        if (operationalYear === 5) {
          stabilizedRevenue = revenueWithDonated;
          stabilizedExpense = expenseWithDonated;
        }
        
        cashFlows.push({
          year,
          amount: revenueWithDonated - expenseWithDonated,
          label: (project.constructionYear + year).toString()
        });
      } else {
        cashFlows.push({ year, amount: 0, label: (project.constructionYear + year).toString() });
      }
    }
    
    const npv = calculateNPV(cashFlows, globalSettings.discountRate);
    const irr = calculateIRR(cashFlows);
    const mirr = calculateMIRR(cashFlows, globalSettings.financeRate, globalSettings.reinvestmentRate);
    const payback = calculatePayback(cashFlows);
    const operatingMargin = stabilizedRevenue > 0 
      ? ((stabilizedRevenue - stabilizedExpense) / stabilizedRevenue) * 100 
      : 0;
    
    return {
      npv, irr, mirr, payback, operatingMargin,
      totalCost, escalatedConstruction, softCosts,
      philanthropyTotal, philanthropyTarget, philanthropyPlug, equityNeeded,
      cashFlows
    };
  }, [project, globalSettings]);
  
  // Export to JSON
  const exportToJSON = () => {
    const exportData = {
      project: project,
      globalSettings: globalSettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  
  // Export to Excel format (CSV for now - will be proper Excel in production)
  const exportToExcel = () => {
    const csvContent = `Field,Value
Business Unit,${project.businessUnit}
Description,${project.descriptionLabel}
FS Revenue Mapping,${project.fsRevenueMapping}
Construction Year,${project.constructionYear}
Construction Month,${project.constructionMonth}
Months Construction,${project.monthsConstruction}
Operational Prep Months,${project.operationalPrepMonths}
Months to Stabilized,${project.monthsToStabilized}
Capital Cost Estimate Date,${project.dateOfCapitalCostEstimate}
Construction Outlay,${project.constructionOutlay}
Soft Cost %,${project.softCostPercentage}
Escalation,${project.escalation}
Philanthropy Goal,${project.philanthropyGoal}
Friends of Kijabe,${project.friendsOfKijabe}
Kijabe Hospital,${project.kijabeHospital}
Samaritan Purse,${project.samaritanPurse}
PPP MRI,${project.pppMRI}
Net Patient Revenue,${project.netPatientRevenue}
Other Revenue,${project.otherRevenue}
Use Expense Override,${project.useExpenseOverride}
Expense Override,${project.expenseOverride}
Labor,${project.laborAtCapacity}
Supplies,${project.suppliesAtCapacity}
Admin,${project.adminAtCapacity}
Donated Labor,${project.donatedLaborAtCapacity}
Targeted Op Level,${project.targetedOperationalLevel}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #ecfdf5)' }}>
      {/* Global Settings Banner */}
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Settings size={20} />
            <span style={{ fontWeight: '600', fontSize: '14px' }}>GLOBAL SETTINGS (All Projects)</span>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', fontSize: '13px' }}>
            <div>Rev Growth: <strong>{(globalSettings.revenueIncrease * 100).toFixed(1)}%</strong></div>
            <div>Labor Infl: <strong>{(globalSettings.expenseInflationLabor * 100).toFixed(1)}%</strong></div>
            <div>Other Infl: <strong>{(globalSettings.expenseInflationNonLabor * 100).toFixed(1)}%</strong></div>
            <div>Discount: <strong>{(globalSettings.discountRate * 100).toFixed(1)}%</strong></div>
            <div>Exchange: <strong>{globalSettings.exchangeRate} KES/USD</strong></div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>
              {project.name} {project.businessUnit && `- ${project.businessUnit}`}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                padding: '4px 12px', 
                background: completion.pct === 100 ? '#dcfce7' : completion.pct >= 75 ? '#fef3c7' : '#fee2e2',
                color: completion.pct === 100 ? '#166534' : completion.pct >= 75 ? '#92400e' : '#991b1b',
                borderRadius: '12px', 
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {completion.pct === 100 ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {completion.pct}% Complete ({completion.filled}/{completion.total} required fields)
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                All inputs in USD
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={exportToJSON}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <Download size={16} />
              Export JSON
            </button>
            
            <button
              onClick={exportToExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <DollarSign size={24} color="#10b981" />
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0 4px 0' }}>
              {formatCurrency(financialMetrics.npv, displayCurrency)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>NPV</div>
          </div>
          
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <TrendingUp size={24} color="#0891b2" />
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0 4px 0' }}>
              {(financialMetrics.irr * 100).toFixed(2)}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>IRR</div>
          </div>
          
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <TrendingUp size={24} color="#8b5cf6" />
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0 4px 0' }}>
              {(financialMetrics.mirr * 100).toFixed(2)}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>MIRR</div>
          </div>
          
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <Calendar size={24} color="#0891b2" />
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0 4px 0' }}>
              {financialMetrics.payback ? financialMetrics.payback.toFixed(1) : 'N/A'} yrs
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Payback</div>
          </div>
          
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <Percent size={24} color="#f59e0b" />
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0 4px 0' }}>
              {financialMetrics.operatingMargin.toFixed(1)}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Op Margin</div>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['overview', 'assumptions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: activeTab === tab ? '#10b981' : '#64748b',
                    borderBottom: activeTab === tab ? '2px solid #10b981' : 'none'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ padding: '24px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Financial Summary</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Cost</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {formatCurrency(financialMetrics.totalCost)}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Philanthropy</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                      {formatCurrency(financialMetrics.philanthropyTotal)}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Equity Needed</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>
                      {formatCurrency(financialMetrics.equityNeeded)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'assumptions' && (
              <div style={{ maxWidth: '900px' }}>
                {/* GENERAL */}
                <CollapsibleSection
                  title="GENERAL INFORMATION"
                  isOpen={sectionsOpen.general}
                  onToggle={() => toggleSection('general')}
                  badge="3 fields"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InputField
                      label="Business Unit"
                      value={project.businessUnit}
                      onChange={(val) => updateProject('businessUnit', val)}
                      type="text"
                      options={['OPD', 'HOUSING', 'ADMIN', 'CLINIC', 'HOSPITAL', 'Other']}
                      required={true}
                      helpText="Select the business unit category"
                    />
                    <InputField
                      label="Description Label"
                      value={project.descriptionLabel}
                      onChange={(val) => updateProject('descriptionLabel', val)}
                      type="text"
                      required={true}
                      helpText="Brief project description"
                    />
                    <InputField
                      label="FS Revenue Mapping"
                      value={project.fsRevenueMapping}
                      onChange={(val) => updateProject('fsRevenueMapping', val)}
                      type="text"
                      helpText="Financial statement revenue line item"
                    />
                  </div>
                </CollapsibleSection>
                
                {/* TIMING */}
                <CollapsibleSection
                  title="TIMING ASSUMPTIONS"
                  isOpen={sectionsOpen.timing}
                  onToggle={() => toggleSection('timing')}
                  badge="5 fields"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InputField
                      label="Construction Year"
                      value={project.constructionYear}
                      onChange={(val) => updateProject('constructionYear', val)}
                      min={2025}
                      max={2040}
                      step={1}
                      required={true}
                    />
                    <InputField
                      label="Construction Month"
                      value={project.constructionMonth}
                      onChange={(val) => updateProject('constructionMonth', val)}
                      min={1}
                      max={12}
                      step={1}
                      required={true}
                      helpText="1=Jan, 12=Dec"
                    />
                    <InputField
                      label="Months Construction"
                      value={project.monthsConstruction}
                      onChange={(val) => updateProject('monthsConstruction', val)}
                      suffix="months"
                      required={true}
                    />
                    <InputField
                      label="Operational Prep Months"
                      value={project.operationalPrepMonths}
                      onChange={(val) => updateProject('operationalPrepMonths', val)}
                      suffix="months"
                    />
                    <InputField
                      label="Months to Stabilized Operation"
                      value={project.monthsToStabilized}
                      onChange={(val) => updateProject('monthsToStabilized', val)}
                      suffix="months"
                      required={true}
                    />
                  </div>
                </CollapsibleSection>
                
                {/* CAPITAL */}
                <CollapsibleSection
                  title="CAPITAL ASSUMPTIONS"
                  isOpen={sectionsOpen.capital}
                  onToggle={() => toggleSection('capital')}
                  badge="4 fields"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InputField
                      label="Date of Capital Cost Estimate"
                      value={project.dateOfCapitalCostEstimate}
                      onChange={(val) => updateProject('dateOfCapitalCostEstimate', val)}
                      type="date"
                    />
                    <InputField
                      label="Construction Outlay (Today's Value)"
                      value={project.constructionOutlay}
                      onChange={(val) => updateProject('constructionOutlay', val)}
                      suffix="USD"
                      required={true}
                      helpText="Total construction cost in USD"
                    />
                    <InputField
                      label="Soft Cost Percentage"
                      value={project.softCostPercentage * 100}
                      onChange={(val) => updateProject('softCostPercentage', val / 100)}
                      suffix="%"
                      min={0}
                      max={100}
                      step={1}
                    />
                    <InputField
                      label="Escalation Rate"
                      value={project.escalation * 100}
                      onChange={(val) => updateProject('escalation', val / 100)}
                      suffix="%"
                      min={0}
                      max={20}
                      step={0.5}
                    />
                  </div>
                </CollapsibleSection>
                
                {/* PHILANTHROPY CAPITAL */}
                <CollapsibleSection
                  title="PHILANTHROPY ASSUMPTIONS: CAPITAL"
                  isOpen={sectionsOpen.philanthropyCapital}
                  onToggle={() => toggleSection('philanthropyCapital')}
                  badge="17 fields"
                >
                  <InputField
                    label="Philanthropy Goal (% of Total Cost)"
                    value={project.philanthropyGoal * 100}
                    onChange={(val) => updateProject('philanthropyGoal', val / 100)}
                    suffix="%"
                    min={0}
                    max={100}
                    step={5}
                  />
                  
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Named Sources (USD):</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      <InputField label="Friends of Kijabe" value={project.friendsOfKijabe} onChange={(val) => updateProject('friendsOfKijabe', val)} />
                      <InputField label="Kijabe Hospital" value={project.kijabeHospital} onChange={(val) => updateProject('kijabeHospital', val)} />
                      <InputField label="Samaritan Purse" value={project.samaritanPurse} onChange={(val) => updateProject('samaritanPurse', val)} />
                      <InputField label="PPP MRI/PET Scan" value={project.pppMRI} onChange={(val) => updateProject('pppMRI', val)} />
                      <InputField label="Additional Need" value={project.additionalNeed} onChange={(val) => updateProject('additionalNeed', val)} />
                      <InputField label="African Mission Healthcare" value={project.africanMissionHealthcare} onChange={(val) => updateProject('africanMissionHealthcare', val)} />
                      <InputField label="CURE" value={project.cure} onChange={(val) => updateProject('cure', val)} />
                      <InputField label="Medical Benevolence Foundation" value={project.medicalBenevolence} onChange={(val) => updateProject('medicalBenevolence', val)} />
                      <InputField label="Unaccounted Partner" value={project.unaccountedPartner} onChange={(val) => updateProject('unaccountedPartner', val)} />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Campaign Details:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <InputField
                        label="Campaign Start Date"
                        value={project.dateCampaignStart}
                        onChange={(val) => updateProject('dateCampaignStart', val)}
                        type="date"
                      />
                      <InputField
                        label="Campaign Duration"
                        value={project.campaignMonths}
                        onChange={(val) => updateProject('campaignMonths', val)}
                        suffix="months"
                      />
                      <InputField
                        label="Level of Campaign Achieved"
                        value={project.levelOfCampaignAchieved * 100}
                        onChange={(val) => updateProject('levelOfCampaignAchieved', val / 100)}
                        suffix="%"
                        helpText="100% = full target achieved"
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px', padding: '16px', background: '#dcfce7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', color: '#166534', lineHeight: '1.8' }}>
                      <strong>Total Entered:</strong> {formatCurrency(financialMetrics.philanthropyTotal)}<br/>
                      <strong>Target ({(project.philanthropyGoal * 100).toFixed(0)}%):</strong> {formatCurrency(financialMetrics.philanthropyTarget)}<br/>
                      <strong>Plug Needed:</strong> {formatCurrency(financialMetrics.philanthropyPlug)}<br/>
                      <strong style={{ color: '#d97706' }}>Equity Needed:</strong> <strong style={{ color: '#d97706' }}>{formatCurrency(financialMetrics.equityNeeded)}</strong>
                    </div>
                  </div>
                </CollapsibleSection>
                
                {/* OPERATIONAL */}
                <CollapsibleSection
                  title="OPERATIONAL ASSUMPTIONS"
                  isOpen={sectionsOpen.operational}
                  onToggle={() => toggleSection('operational')}
                  badge="14 fields"
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <InputField
                      label="Business Unit Total Capacity"
                      value={project.businessUnitTotalCapacity}
                      onChange={(val) => updateProject('businessUnitTotalCapacity', val)}
                      helpText="Units (visits, beds, etc.)"
                    />
                    <InputField
                      label="Targeted Operational Level"
                      value={project.targetedOperationalLevel * 100}
                      onChange={(val) => updateProject('targetedOperationalLevel', val / 100)}
                      suffix="% of capacity"
                      required={true}
                    />
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Revenue at Full Capacity (USD):</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <InputField
                        label="Net Patient Revenue"
                        value={project.netPatientRevenue}
                        onChange={(val) => updateProject('netPatientRevenue', val)}
                        helpText="Primary revenue source"
                      />
                      <InputField
                        label="Other Revenue"
                        value={project.otherRevenue}
                        onChange={(val) => updateProject('otherRevenue', val)}
                      />
                    </div>
                    {!completion.hasRevenue && (
                      <div style={{ marginTop: '12px', padding: '12px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', fontSize: '13px' }}>
                        ⚠️ At least one revenue source is required
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginTop: '20px', padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={project.useExpenseOverride}
                        onChange={(e) => updateProject('useExpenseOverride', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                        Use Expense Override (Single Total Value)
                      </span>
                    </label>
                  </div>
                  
                  {project.useExpenseOverride ? (
                    <InputField
                      label="Total Expense Override"
                      value={project.expenseOverride}
                      onChange={(val) => updateProject('expenseOverride', val)}
                      suffix="USD"
                      required={true}
                      helpText="Total operating expenses at full capacity"
                    />
                  ) : (
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Detailed Expense Breakdown (USD):</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        <InputField
                          label="Labor @ Full Capacity"
                          value={project.laborAtCapacity}
                          onChange={(val) => updateProject('laborAtCapacity', val)}
                          required={true}
                        />
                        <InputField
                          label="Supplies & Other @ Full Capacity"
                          value={project.suppliesAtCapacity}
                          onChange={(val) => updateProject('suppliesAtCapacity', val)}
                          required={true}
                        />
                        <InputField
                          label="Administrative/Property Costs @ Full Capacity"
                          value={project.adminAtCapacity}
                          onChange={(val) => updateProject('adminAtCapacity', val)}
                          required={true}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '20px' }}>
                    <InputField
                      label="Donated Labor @ Full Capacity (Non-Cash)"
                      value={project.donatedLaborAtCapacity}
                      onChange={(val) => updateProject('donatedLaborAtCapacity', val)}
                      suffix="USD"
                      helpText="Added to both revenue & expense - no cash impact"
                    />
                  </div>
                </CollapsibleSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
