import re

with open('/home/badhon/Documents/GrabAll/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Fix properties that are missing curly braces: prop= key: value, key2: value
def fix_prop(match):
    prop = match.group(1)
    val = match.group(2)
    # If it already starts with { or ", leave it alone
    if val.strip().startswith('{') or val.strip().startswith('"') or val.strip().startswith("'") or val.strip().startswith('['):
        return match.group(0)
    
    # We want to wrap the whole expression in {{ }}
    # But wait, some are like: animate= inView ? { opacity: 1 } : {}
    if '?' in val and ':' in val and '{' in val:
        # Wrap in a single {}
        return f"{prop}={{{val}}}"
    
    return f"{prop}={{{{{val}}}}}"

# Match prop= <something> until the end of the line or before another prop/tag closing
# A bit tricky with regex, we can match specific known lines.

import sys
lines = content.split('\n')
new_lines = []
for line in lines:
    original = line
    # fix initial= opacity: 0, y
    line = re.sub(r'(initial|animate|transition|whileHover|whileTap|style)\s*=\s*([^>]*?)(?=\s*(?:className|style|initial|animate|transition|while|ref|onClick|onMouse|\/>|>))', 
                  lambda m: m.group(1) + '={{' + m.group(2).strip() + '}} ' if not m.group(2).strip().startswith('{') and not m.group(2).strip().startswith('"') else m.group(0), 
                  line)
                  
    # The above regex might be too greedy or not greedy enough, let's do targeted replaces based on common patterns in the file
    line = re.sub(r'initial=\s*(opacity:[^>]+?)(?=\s+(?:className|animate|transition|while|ref|onClick|\/>|>))', r'initial={{\1}}', line)
    line = re.sub(r'animate=\s*(opacity:[^>]+?)(?=\s+(?:className|initial|transition|while|ref|onClick|\/>|>))', r'animate={{\1}}', line)
    line = re.sub(r'animate=\s*(scale:[^>]+?)(?=\s+(?:className|initial|transition|while|ref|onClick|\/>|>))', r'animate={{\1}}', line)
    line = re.sub(r'animate=\s*(x:[^>]+?)(?=\s+(?:className|initial|transition|while|ref|onClick|\/>|>))', r'animate={{\1}}', line)
    line = re.sub(r'transition=\s*(duration:[^>]+?)(?=\s+(?:className|initial|animate|while|ref|onClick|\/>|>))', r'transition={{\1}}', line)
    line = re.sub(r'transition=\s*(delay:[^>]+?)(?=\s+(?:className|initial|animate|while|ref|onClick|\/>|>))', r'transition={{\1}}', line)
    line = re.sub(r'transition=\s*(x:[^>]+?)(?=\s+(?:className|initial|animate|while|ref|onClick|\/>|>))', r'transition={{\1}}', line)
    line = re.sub(r'whileHover=\s*(scale:[^>]+?)(?=\s+(?:className|initial|animate|transition|while|ref|onClick|\/>|>))', r'whileHover={{\1}}', line)
    line = re.sub(r'whileTap=\s*(scale:[^>]+?)(?=\s+(?:className|initial|animate|transition|while|ref|onClick|\/>|>))', r'whileTap={{\1}}', line)
    
    # Catching line 65-68 specifically
    if "initial= opacity: 0, y" in line:
        line = line.replace("initial= opacity: 0, y", "initial={{ opacity: 0, y }}")
    if "animate = { inView? { opacity: 1, y: 0 } : { }" in line:
        line = line.replace("animate = { inView? { opacity: 1, y: 0 } : { }", "animate={inView ? { opacity: 1, y: 0 } : {}}")
    if "transition = duration: 0.7, delay, ease: [0.22, 1, 0.36, 1]" in line:
        line = line.replace("transition = duration: 0.7, delay, ease: [0.22, 1, 0.36, 1]", "transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}")
    if "className = { className }" in line:
        line = line.replace("className = { className }", "className={className}")
    
    if "initial= opacity: 0, scale: 0" in line:
        line = line.replace("initial= opacity: 0, scale: 0", "initial={{ opacity: 0, scale: 0 }}")
        
    new_lines.append(line)

with open('/home/badhon/Documents/GrabAll/frontend/src/App.tsx', 'w') as f:
    f.write('\n'.join(new_lines))

print("Fixed JSX props.")
