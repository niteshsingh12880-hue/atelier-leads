$connections = netstat -ano | Select-String ':3000'
foreach ($line in $connections) {
  $parts = ($line.ToString() -split '\s+') | Where-Object { $_ }
  $processId = $parts[-1]
  if ($processId -match '^\d+$') {
    Stop-Process -Id ([int]$processId) -Force -ErrorAction SilentlyContinue
  }
}
Set-Location 'C:\Users\ARJUN\OneDrive\Desktop\atelier-leads'
npm run dev -- --hostname 127.0.0.1 --port 3000
