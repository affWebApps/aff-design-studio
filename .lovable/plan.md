

# Fashion Design Studio with FreeSewing Engine

## Overview
A web-based fashion design studio where users create made-to-measure garment patterns using FreeSewing's parametric engine, manipulate designs visually with drag handles, and export in SVG/PDF/DXF formats.

## Pages & Layout

### 1. Landing Page
- Hero section showcasing the tool with sample pattern previews
- Feature highlights (parametric design, drag-to-edit, multi-format export)
- Call-to-action to sign up or try a demo

### 2. Auth Pages (Login / Sign Up)
- Email-based authentication via Supabase
- Password reset flow

### 3. Dashboard
- Grid of saved designs with thumbnails
- Create new design button
- Search/filter designs

### 4. Design Studio (Main Editor)
- **Left Panel**: Pattern selector (FreeSewing patterns like bodice, sleeve, skirt blocks) and measurement inputs (bust, waist, hip, etc.)
- **Center Canvas**: Interactive SVG canvas rendering the FreeSewing pattern output, with draggable control points overlaid on key pattern nodes — dragging updates the underlying parameters in real-time
- **Right Panel**: Design options specific to the selected pattern (ease, style variations, seam allowances)
- **Top Toolbar**: Undo/redo, zoom controls, export buttons (SVG, PDF, DXF)

## Core Features

### Parametric Pattern Engine
- Integrate `@freesewing/core` npm package to generate patterns client-side
- Render FreeSewing's SVG output onto an interactive canvas
- Changing any measurement or option instantly re-renders the pattern

### Visual Drag Handles
- Overlay draggable control points on key pattern landmarks
- Dragging a point reverse-maps to the closest measurement parameter and updates it
- Real-time re-render as the user drags

### Multi-Format Export
- **SVG**: Direct from FreeSewing output
- **PDF**: Generate tiled, print-ready pages at actual scale using a client-side PDF library
- **DXF**: Convert SVG paths to DXF format for CAD software compatibility

### Cloud Persistence (Supabase)
- User accounts with authentication
- Save/load designs with all measurements and options
- Auto-save functionality
- Design thumbnails generated from SVG snapshots

## Design Style
- Clean, professional UI with a dark/light mode toggle
- Minimal chrome around the canvas to maximize workspace
- Subtle grid background on the canvas for scale reference

