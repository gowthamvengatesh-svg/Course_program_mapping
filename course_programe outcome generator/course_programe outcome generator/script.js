let coCount = localStorage.getItem("coCount") || 5
coCount = parseInt(coCount)

let remembering=["copying","defining","finding","locating","quoting","listening","googling","repeating","retrieving","outlining","highlighting","memorizinig","networking","searching","identifying","selecting","tabulating","duplicating","matching","bookmarking","bullet-pointing","list","recite","define","name","match","quote","recall","identify","label","recognize"];
let understanding=["annotating","tweeting","associating","tagging","summarizing","relating","categorizing","paraphrasing","predicting","comparing","contrasting","commenting","journaling","interpreting","grouping","inferring","estimating","extending","gathering","exemplifying","expressing","describe","explain","paraphrase","restate","give original examples of","illustrate","summarize","contrast","interpret","discuss","outline"];
let applying=["deconstructing","organizing","build","construct","attributing","outlining","finding","structuring","integrating","mapping","dissecting","relating","comparing","contrasting","distinguishing","examine","experimenting","questioning"];
let analyzing=["checking","hypothesizing","critique","experimenting","judging","testing","detecting","monitoring","measuring","assessing","comparing","discriminating","justifying","verifying","appraising","argue","defend","judge","select","support"];
let creating=["design","plan","produce","invent"];

let poLevels=[3,4,5,5,6,3,2,3,3,2,3,3,4]

function renderCOTable(){

let body=document.getElementById("coBody")
if(!body) return

body.innerHTML=""

for(let i=1;i<=coCount;i++){

let value=localStorage.getItem("course"+i) || ""
let k=localStorage.getItem("Klevel"+i) || ""

body.innerHTML+=`

<tr>

<th>CO${i}</th>

<td>
<input id="course${i}" class="co-input" value="${value}" oninput="saveCO(${i})">
</td>

<td id="KC${i}">
${k ? "K"+k : ""}
</td>

</tr>

`

}

}


function saveCO(i){

let sentence=document.getElementById("course"+i).value

localStorage.setItem("course"+i,sentence)

let word=sentence.trim().split(" ")[0].toLowerCase()

let level=0

if(remembering.includes(word)) level=1
else if(understanding.includes(word)) level=2
else if(applying.includes(word)) level=3
else if(analyzing.includes(word)) level=4
else if(creating.includes(word)) level=5

document.getElementById("KC"+i).innerText=level?"K"+level:""

localStorage.setItem("Klevel"+i,level)

loadSuggestion()

}


function addCORow(){

coCount++

localStorage.setItem("coCount",coCount)

renderCOTable()

}

function removeCORow(){

if(coCount<=1) return

localStorage.removeItem("course"+coCount)
localStorage.removeItem("Klevel"+coCount)

coCount--

localStorage.setItem("coCount",coCount)

renderCOTable()

}

function loadSuggestion(){

let body=document.getElementById("mappingBody")

if(!body) return

body.innerHTML=""

for(let i=1;i<=coCount;i++){

let k=localStorage.getItem("Klevel"+i)

if(!k) continue

let row=`<tr>

<th>CO${i}</th>

<td colspan="2">K${k}</td>`

for(let j=0;j<13;j++){

let saved=localStorage.getItem("R"+i+"C"+(j+1))

let value="-"

if(saved){

value=saved

}
else{

let diff=Math.abs(k-poLevels[j])

if(diff==0) value=3
else if(diff==1) value=2
else if(diff==2) value=1

}

row+=`<td id="R${i}C${j+1}">${value}</td>`

}

row+=`</tr>`

body.innerHTML+=row

}

calculateContribution()

generateAISuggestions()

}


document.addEventListener("click", function(e){

if(e.target.tagName === "TD" && e.target.id){

let cell = e.target

if(cell.querySelector("input")) return

let oldValue = cell.innerText

let input = document.createElement("input")

input.type = "text"
input.value = oldValue
input.style.width = "50px"

cell.innerHTML = ""
cell.appendChild(input)

input.focus()

input.onblur = function(){

let newVal = input.value

cell.innerHTML = newVal

localStorage.setItem(cell.id, newVal)

if(cell.id.startsWith("cc")){
localStorage.setItem(cell.id,newVal)
}

}

}

})

function calculateContribution(){

for(let col=1; col<=13; col++){

let total=0

for(let row=1; row<=coCount; row++){

let cell=document.getElementById("R"+row+"C"+col)

if(!cell) continue

let value=parseInt(cell.innerText)

if(!isNaN(value)){

total+=value

localStorage.setItem("R"+row+"C"+col,value)

}
}

let finaltotal=Math.round(total/coCount)

let cc=document.getElementById("cc"+col)

if(cc){

let manual = localStorage.getItem("cc"+col)

if(manual){
cc.innerText = manual
}
else{
cc.innerText = finaltotal
}

}
}
}

function calculateApprovedContribution(){

for(let col=1; col<=13; col++){

let total = 0

for(let row=1; row<=coCount; row++){

let cell = document.querySelector(`#approvedBody tr:nth-child(${row}) td:nth-child(${col+2})`)

if(!cell) continue

let value = parseInt(cell.innerText)

if(!isNaN(value)){
total += value
}

}

let final = Math.round(total / coCount)

let fc = document.getElementById("fc"+col)

if(fc){
fc.innerText = final
}

}

}

function generateAISuggestions(){

let body = document.getElementById("aiSuggestions")

if(!body) return

body.innerHTML=""

let suggestions={

1:"Add numerical problem solving",
2:"Use analytical case studies",
3:"Add design assignments",
4:"Conduct lab experiments",
5:"Use simulation tools",
6:"Discuss societal impact",
7:"Professional ethics discussion",
8:"Group teamwork activity",
9:"Student presentation",
10:"Project planning exercise",
11:"Research paper discussion",
12:"Circuit design activity",
13:"Hardware implementation"

}

for(let i=1;i<=coCount;i++){

for(let j=1;j<=13;j++){

let cell=document.getElementById("R"+i+"C"+j)

if(!cell) continue

let v=parseInt(cell.innerText)

if(isNaN(v) || v < 3){

let id=`S${i}_${j}`

body.innerHTML+=`

<tr>

<td>CO${i}</td>
<td>PO${j}</td>
<td>${suggestions[j]}</td>

<td>

<label>
<input type="radio" name="${id}" value="yes"
onclick="saveSuggestion('${id}','yes')">Yes
</label>

<label>
<input type="radio" name="${id}" value="no"
onclick="saveSuggestion('${id}','no')" checked>No
</label>

</td>

</tr>

`

}

}

}

}

function saveSuggestion(id,value){

localStorage.setItem(id,value)

}

function generateFinalTable(){

let body = document.getElementById("approvedBody")

if(!body) return

body.innerHTML=""

for(let i=1;i<=coCount;i++){

let k = localStorage.getItem("Klevel"+i)

let row = `<tr>
<th>CO${i}</th>
<td colspan="2">K${k}</td>`

for(let j=1;j<=13;j++){

let id = `S${i}_${j}`

let decision = localStorage.getItem(id)

let cell = document.getElementById("R"+i+"C"+j)

let value = cell ? cell.innerText : "-"

value = parseInt(value)

if(isNaN(value)) value = 0

if(decision === "yes"){
value = value + 1
if(value > 3) value = 3
}

row += `<td>${value}</td>`

}

row += "</tr>"

body.innerHTML += row

}

calculateApprovedContribution()

}

function exportExcel(){

let table=document.getElementById("mappingTable")

let html=table.outerHTML

let url='data:application/vnd.ms-excel,'+encodeURIComponent(html)

let link=document.createElement("a")

link.href=url

link.download="CO_PO_Mapping.xls"

link.click()

}

function exportPDF(){

window.print()

}

function printTable(type){

localStorage.setItem("printMode",type);

if(type==="suggested"){
    window.location.href="table1.html";
}

else{
    window.location.href="table2.html";
}

}




window.onload=function(){

renderCOTable()

loadSuggestion()

}