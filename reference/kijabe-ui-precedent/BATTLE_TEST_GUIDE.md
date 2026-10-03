# PROJECT 1 - Complete Interface - Battle Testing Guide

## 🎉 **READY FOR TESTING!**

You now have the **complete PROJECT 1 interface** with all 44 input fields from your KHCapitalPlanner.xlsx Excel model.

---

## 📥 **Setup Instructions**

### **Step 1: Open CodeSandbox**
Go to: **https://codesandbox.io/s/new**

### **Step 2: Add Dependencies**
1. Click **"Dependencies"** in left sidebar
2. Add: **`recharts`**
3. Add: **`lucide-react`**
4. Wait ~10 seconds for installation

### **Step 3: Replace Code**
1. Click **`App.js`** in file tree
2. Delete all existing code
3. Download **`project1-complete.jsx`** (above)
4. Copy ALL code from that file
5. Paste into App.js
6. Preview loads automatically!

---

## ✨ **What You'll See**

### **🎯 Top Green Banner - Global Settings**
These apply to ALL projects (when we scale to 10):
- Revenue Growth: 4.0%
- Labor Inflation: 5.0%
- Other Inflation: 4.0%
- Discount Rate: 8.0%
- Exchange Rate: 130 KES/USD

### **📊 Header Section**
- Project name and business unit
- **Progress indicator**: Shows % of required fields completed
- **Two export buttons**:
  - 📥 Export JSON (for your learning!)
  - 📥 Export Excel (CSV format for now)

### **💰 5 Financial Metrics Cards**
- NPV (Net Present Value)
- IRR (Internal Rate of Return)
- MIRR (Modified IRR - better for real estate)
- Payback Period
- Operating Margin

### **📑 Two Tabs**

**OVERVIEW Tab:**
- Financial summary boxes
- Total Cost, Philanthropy, Equity Needed

**ASSUMPTIONS Tab:**
All 44 input fields organized in 6 collapsible sections:

1. **GENERAL INFORMATION (3 fields)**
   - Business Unit ⭐ REQUIRED dropdown
   - Description Label ⭐ REQUIRED
   - FS Revenue Mapping

2. **TIMING ASSUMPTIONS (5 fields)**
   - Construction Year ⭐ REQUIRED
   - Construction Month ⭐ REQUIRED
   - Months Construction ⭐ REQUIRED
   - Operational Prep Months
   - Months to Stabilized ⭐ REQUIRED

3. **CAPITAL ASSUMPTIONS (4 fields)**
   - Date of Estimate
   - Construction Outlay ⭐ REQUIRED
   - Soft Cost %
   - Escalation Rate

4. **PHILANTHROPY: CAPITAL (17 fields)**
   - Philanthropy Goal %
   - 9 Named Sources (Friends of Kijabe, Kijabe Hospital, etc.)
   - Campaign Start Date
   - Campaign Duration
   - Achievement Level
   - Shows calculated: Total, Target, Plug, Equity Needed

5. **OPERATIONAL ASSUMPTIONS (14 fields)**
   - Business Unit Capacity
   - Targeted Op Level ⭐ REQUIRED
   - Net Patient Revenue (at least one revenue required)
   - Other Revenue
   - **☑ Expense Override Checkbox** ← Decision tree!
   - IF checked: Expense Override ⭐ REQUIRED
   - IF unchecked: Labor, Supplies, Admin ⭐ ALL REQUIRED
   - Donated Labor (non-cash)

---

## 🎯 **Battle Testing Checklist**

### **Test 1: Required Field Validation**
- [ ] Leave Business Unit empty → Should show red border + "Required field"
- [ ] Progress indicator should show <100%
- [ ] Fill Business Unit → Red border disappears
- [ ] Progress % increases

### **Test 2: Conditional Logic (Expense Override)**
**Scenario A:**
- [ ] Check "Use Expense Override" box
- [ ] Enter Expense Override value
- [ ] Labor/Supplies/Admin should be grayed out (not required)
- [ ] Progress should show complete if all other required fields filled

**Scenario B:**
- [ ] Uncheck "Use Expense Override" box
- [ ] Labor, Supplies, Admin should become required
- [ ] Enter values for all three
- [ ] Progress should update

### **Test 3: Business Unit Dropdown**
- [ ] Click Business Unit field
- [ ] Should see: OPD, HOUSING, ADMIN, CLINIC, HOSPITAL, Other
- [ ] Select one → Should save and display

### **Test 4: Financial Calculations**
- [ ] Enter Construction Outlay: $10,000,000
- [ ] Enter Net Patient Revenue: $2,000,000
- [ ] Enter Expense Override: $1,500,000
- [ ] Check metrics cards update:
  - NPV should calculate
  - IRR should show a %
  - MIRR should show a %
  - Payback should show years
  - Operating Margin should show %

### **Test 5: Philanthropy Calculation**
- [ ] Enter Philanthropy Goal: 80%
- [ ] Enter total Construction Outlay: $10,000,000
- [ ] Philanthropy section should show:
  - Target: $8,000,000 (80% of $10M)
- [ ] Enter Friends of Kijabe: $5,000,000
- [ ] Should show:
  - Total Entered: $5,000,000
  - Plug Needed: $3,000,000
  - Equity Needed: $2,000,000

### **Test 6: Export to JSON**
- [ ] Click "Export JSON" button
- [ ] File should download: `PROJECT_1_2026-02-XX.json`
- [ ] Open file in text editor
- [ ] Should see all your data in JSON format
- [ ] Look for: `"businessUnit": "OPD"`, etc.

### **Test 7: Export to Excel**
- [ ] Click "Export Excel" button  
- [ ] File should download: `PROJECT_1_2026-02-XX.csv`
- [ ] Open in Excel or text editor
- [ ] Should see: Field,Value format
- [ ] All your inputs should be listed

### **Test 8: Revenue Requirement**
- [ ] Clear Net Patient Revenue (set to 0)
- [ ] Clear Other Revenue (set to 0)
- [ ] Should see warning: "⚠️ At least one revenue source is required"
- [ ] Enter revenue in either field → Warning disappears

### **Test 9: Collapsible Sections**
- [ ] Click "TIMING ASSUMPTIONS" header
- [ ] Section should collapse (hide fields)
- [ ] Click again → Should expand
- [ ] All sections should work this way

### **Test 10: Progress Tracking**
- [ ] Start fresh (reload page)
- [ ] Progress should show low % (many fields empty)
- [ ] Fill required fields one by one
- [ ] Watch progress % increase
- [ ] When all required fields filled → Should show 100%
- [ ] Green checkmark should appear

---

## 🐛 **Known Issues to Test**

### **Issue 1: Date Fields**
- Safari might display date fields differently
- Test entering dates in both fields
- Format should be: YYYY-MM-DD

### **Issue 2: Decimal Entry**
- Test entering: 0.8 vs 80% (system should handle both)
- Percentages convert automatically (80 becomes 0.8 internally)

### **Issue 3: Large Numbers**
- Enter: 19200000 (no commas)
- Display should format with commas where appropriate

---

## 📊 **Sample Data to Test**

Use this to quickly fill all required fields:

```
GENERAL:
Business Unit: OPD
Description: Outpatient Multidisciplinary Center
FS Mapping: Outpatient revenue

TIMING:
Construction Year: 2027
Construction Month: 7
Months Construction: 18
Months to Stabilized: 36

CAPITAL:
Construction Outlay: 19200000
Soft Cost %: 0
Escalation: 0

PHILANTHROPY:
Goal: 80%
Friends of Kijabe: 4000000
Kijabe Hospital: 2000000
Samaritan Purse: 6000000
PPP MRI: 3000000

OPERATIONAL:
Business Unit Capacity: 450000
Net Patient Revenue: 8027286
☑ Use Expense Override
Expense Override: 4865105
Targeted Op Level: 80%
```

This should give you:
- ✅ 100% complete
- ✅ All calculations working
- ✅ Ready to export

---

## 💡 **JSON Import Instructions (Your Q3 Request)**

**Why JSON is useful:**
- Standard data interchange format
- Easy to read and edit
- Can be imported into any system
- Version controlled with Git
- Can be programmatically processed

**How to use the JSON export:**

1. **Export from React:**
   - Click "Export JSON"
   - Opens file like: `PROJECT_1_2026-02-15.json`

2. **File structure:**
```json
{
  "project": {
    "id": 1,
    "name": "PROJECT 1",
    "businessUnit": "OPD",
    "constructionOutlay": 19200000,
    ...
  },
  "globalSettings": {
    "discountRate": 0.08,
    ...
  },
  "exportDate": "2026-02-15T10:30:00Z",
  "version": "1.0"
}
```

3. **Import into Excel (Power Query):**
   - Excel → Data tab → Get Data → From File → From JSON
   - Select your .json file
   - Power Query Editor opens
   - Click "project" → Expand all fields
   - Load to worksheet

4. **Manual paste method:**
   - Open JSON in text editor
   - Copy values you need
   - Paste into your Excel cells

5. **Python import (if you code):**
```python
import json
with open('PROJECT_1_2026-02-15.json', 'r') as f:
    data = json.load(f)
    
print(data['project']['constructionOutlay'])  # 19200000
```

---

## ✅ **What to Report Back**

After battle testing, please tell me:

### **What Works:**
- [ ] Which features work perfectly
- [ ] Which calculations are accurate
- [ ] UI elements that are clear and helpful

### **What Needs Fixing:**
- [ ] Any bugs or errors
- [ ] Fields that don't save properly
- [ ] Calculations that seem wrong
- [ ] UI elements that are confusing

### **What's Missing:**
- [ ] Any required fields not present
- [ ] Features you expected but don't see
- [ ] Validation that should exist but doesn't

### **Suggestions:**
- [ ] Better labels for fields
- [ ] Different organization of sections
- [ ] Additional help text needed
- [ ] Export format improvements

---

## 🚀 **Next Steps After Testing**

Once you approve:

1. **Tweaks** - I fix anything you find
2. **Scale to 10 projects** - Replicate for all projects
3. **Add "Create New Project"** - Let them add 5 more (15 total)
4. **Multi-project selector** - Choose multiple, see consolidated view
5. **Business unit aggregation** - Roll up by OPD, HOUSING, etc.

---

## 💬 **Quick Questions While Testing**

**Q: Can I save my work?**
A: CodeSandbox auto-saves. Just bookmark the URL or sign in to keep it permanently.

**Q: How do I share this?**
A: Copy the CodeSandbox URL and send it to anyone. They can view/edit their own copy.

**Q: The preview isn't showing?**
A: Look for the preview panel on the right, or click the eye icon (👁️) at top.

**Q: I see errors in console?**
A: Make sure dependencies (recharts, lucide-react) are installed and App.js has the code.

---

## 🔥 **READY TO BATTLE TEST!**

**Take your time. Test thoroughly. Break things. Report back everything you find.**

This is the foundation for the entire system - let's get it perfect before scaling! 💪

---

**Version**: Project 1 Complete - v1.0  
**Date**: February 2026  
**Status**: Ready for Battle Testing
