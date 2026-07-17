#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Planilha Seletor/Comparador de Fundações (Kit do Curso 2).
Abas: Parametros, Seletor (fórmulas de triagem), Comparador (matriz de referência), Dashboard.
Triagem espelha a árvore de decisão do curso (NBR 6122). Decisão final: projetista de fundações.
Saída: 04-curso-fundacoes/kit/planilha/planilha-fundacoes.xlsx"""
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule

VERDE="0E3A34"; VMED="1C5A4E"; CREME="F5EFE0"; CREME2="FBF8F0"; DOUR="C9A24B"; CARVAO="20211E"; CINZA="6B6B63"
f_tit=Font(name="Georgia",size=15,bold=True,color=CREME)
f_hdr=Font(name="Calibri",size=10,bold=True,color=CREME)
f_lbl=Font(name="Calibri",size=10,bold=True,color=VERDE)
f_norm=Font(name="Calibri",size=10,color=CARVAO)
f_small=Font(name="Calibri",size=8.5,italic=True,color=CINZA)
fill_v=PatternFill("solid",fgColor=VERDE); fill_vm=PatternFill("solid",fgColor=VMED)
fill_c2=PatternFill("solid",fgColor=CREME2); fill_d=PatternFill("solid",fgColor=DOUR)
fill_rasa=PatternFill("solid",fgColor="D9EAD3"); fill_prof=PatternFill("solid",fgColor="CFE2F3"); fill_cinza=PatternFill("solid",fgColor="FFF2CC")
thin=Side(style="thin",color="D9D2BE"); border=Border(left=thin,right=thin,top=thin,bottom=thin)
center=Alignment(horizontal="center",vertical="center",wrap_text=True)
left=Alignment(horizontal="left",vertical="center",wrap_text=True)

wb=Workbook()

# ---------- PARAMETROS ----------
wp=wb.active; wp.title="Parametros"; wp.sheet_view.showGridLines=False
wp["A1"]="PARÂMETROS DE TRIAGEM — ajuste e assine (convenção do curso)"; wp["A1"].font=f_tit; wp["A1"].fill=fill_v
wp.merge_cells("A1:D1"); wp.row_dimensions[1].height=26; wp["A1"].alignment=Alignment(horizontal="left",vertical="center")
params=[
 ("Limite camada RASA (m)",3.0,"Camada resistente até esta profundidade favorece fundação rasa. [VALIDAR E1]"),
 ("Limite camada PROFUNDA (m)",8.0,"Camada resistente a partir desta profundidade favorece fundação profunda. [VALIDAR E2]"),
 ("NA alto se profundidade < (m)",2.0,"Nível d'água mais raso que isto liga o alerta de água. [VALIDAR]"),
]
wp["A3"]="Parâmetro"; wp["B3"]="Valor"; wp["C3"]="Observação / fonte"
for c in ("A3","B3","C3"): wp[c].font=f_hdr; wp[c].fill=fill_vm; wp[c].alignment=left; wp[c].border=border
r=4
for nome,val,obs in params:
    wp[f"A{r}"]=nome; wp[f"A{r}"].font=f_lbl
    wp[f"B{r}"]=val; wp[f"B{r}"].font=f_norm; wp[f"B{r}"].number_format="0.0"; wp[f"B{r}"].fill=fill_d; wp[f"B{r}"].alignment=center
    wp[f"C{r}"]=obs; wp[f"C{r}"].font=f_small; wp[f"C{r}"].alignment=left
    for col in "ABC": wp[f"{col}{r}"].border=border
    r+=1
wp["A8"]="Referência N-SPT (mecânica dos solos) — apresentar como referência, confirmar faixas [VALIDAR E5]"
wp["A8"].font=f_lbl; wp.merge_cells("A8:D8")
ref=[("Solo","N-SPT (ref.)","Consistência/compacidade"),
     ("Argila (coesivo)","≤ 2 / 3-5 / 6-10 / >10","mole / média / rija / dura*"),
     ("Areia (granular)","≤ 4 / 5-8 / 9-18 / >18","fofa / pouco compacta / medianam. / compacta*")]
for i,(a,b,c) in enumerate(ref):
    for j,val in enumerate((a,b,c)):
        cell=wp.cell(row=9+i,column=1+j,value=val); cell.border=border
        cell.font=(f_hdr if i==0 else f_norm); cell.alignment=left
        if i==0: cell.fill=fill_vm
wp["A13"]="* faixas ilustrativas — confirmar com a bibliografia adotada. Não substituem o projeto geotécnico."
wp["A13"].font=f_small; wp.merge_cells("A13:D13")
wp.column_dimensions["A"].width=30; wp.column_dimensions["B"].width=16; wp.column_dimensions["C"].width=40

# ---------- SELETOR ----------
ws=wb.create_sheet("Seletor"); ws.sheet_view.showGridLines=False
ws["A1"]="SELETOR DE FUNDAÇÃO — triagem por caso (decisão final: projetista de fundações, NBR 6122)"
ws["A1"].font=f_tit; ws["A1"].fill=fill_v; ws.merge_cells("A1:J1"); ws.row_dimensions[1].height=24
ws["A1"].alignment=Alignment(horizontal="left",vertical="center")
headers=[("A","Nº",6),("B","Apoio / Setor",18),("C","Prof. camada resistente (m)",13),
 ("D","Prof. do NA (m)",11),("E","Carga",10),("F","Vizinhança sensível?",12),("G","Acesso restrito?",11),
 ("H","Família (triagem)",14),("I","Tipos candidatos",30),("J","Alerta",30)]
for col,txt,w in headers:
    c=ws[f"{col}2"]; c.value=txt; c.font=f_hdr; c.fill=fill_v; c.alignment=center; c.border=border
    ws.column_dimensions[col].width=w
ws.row_dimensions[2].height=30; ws.freeze_panes="A3"
FIRST,LAST=3,102
for row in range(FIRST,LAST+1):
    ws[f"H{row}"]=(f'=IF(OR(C{row}="",E{row}=""),"",'
        f'IF(AND(C{row}<=Parametros!$B$4,E{row}<>"alta"),"RASA",'
        f'IF(OR(C{row}>=Parametros!$B$5,E{row}="alta"),"PROFUNDA","ZONA CINZENTA")))')
    ws[f"I{row}"]=(f'=IF(H{row}="","",'
        f'IF(H{row}="RASA","Sapata (isolada/corrida/associada) ou radier",'
        f'IF(H{row}="PROFUNDA",'
        f'IF(F{row}="Sim","Estaca helice continua/escavada (sem trepidacao)","Estaca (pre-moldada/helice) ou tubulao*")'
        f'&IF(G{row}="Sim","; acesso restrito: raiz/Strauss",""),'
        f'"Levar ao projetista (decisao final)")))')
    ws[f"J{row}"]=(f'=IF(H{row}="","",'
        f'TRIM('
        f'IF(D{row}<>"",IF(D{row}<Parametros!$B$6,"NA alto: cautela tubulao a ceu aberto. ",""),"")'
        f'&IF(H{row}="PROFUNDA",IF(F{row}="Sim","Vizinhanca sensivel: evitar cravacao. ",""),"")'
        f'&IF(H{row}="ZONA CINZENTA","Decisao do projetista; desempate pelo custo da falha. ","")'
        f'&IF(E{row}="alta","Carga alta: dimensionamento pelo projetista. ","")))')
    for col,_,_ in headers:
        cell=ws[f"{col}{row}"]; cell.font=f_norm; cell.border=border
        cell.alignment=center if col in("A","C","D","E","F","G","H") else left
        if row%2==0: cell.fill=fill_c2
    ws[f"C{row}"].number_format="0.0"; ws[f"D{row}"].number_format="0.0"
dvs={"E":'"leve,media,alta"',"F":'"Sim,Nao"',"G":'"Sim,Nao"'}
for col,formula in dvs.items():
    dv=DataValidation(type="list",formula1=formula,allow_blank=True); dv.showInputMessage=True
    dv.prompt="Selecione uma opção"; ws.add_data_validation(dv); dv.add(f"{col}{FIRST}:{col}{LAST}")
rng=f"H{FIRST}:H{LAST}"
ws.conditional_formatting.add(rng,CellIsRule(operator="equal",formula=['"RASA"'],fill=fill_rasa,font=Font(color="1b4d1f",bold=True)))
ws.conditional_formatting.add(rng,CellIsRule(operator="equal",formula=['"PROFUNDA"'],fill=fill_prof,font=Font(color="0b3d66",bold=True)))
ws.conditional_formatting.add(rng,CellIsRule(operator="equal",formula=['"ZONA CINZENTA"'],fill=fill_cinza,font=Font(color="9C6500",bold=True)))

# ---------- COMPARADOR (referência) ----------
wc=wb.create_sheet("Comparador"); wc.sheet_view.showGridLines=False
wc["A1"]="COMPARADOR DE TIPOS — referência rápida (a validar com o projetista)"
wc["A1"].font=f_tit; wc["A1"].fill=fill_v; wc.merge_cells("A1:E1"); wc.row_dimensions[1].height=24
wc["A1"].alignment=Alignment(horizontal="left",vertical="center")
cols=["Tipo","Família","Quando entra na conversa","Cuidado / limite","Ref."]
for j,c in enumerate(cols):
    cell=wc.cell(row=2,column=1+j,value=c); cell.font=f_hdr; cell.fill=fill_vm; cell.alignment=center; cell.border=border
linhas=[
 ("Sapata isolada","Rasa","Carga de pilar sobre camada firme rasa","Recalque se solo mole/heterogêneo","NBR 6122"),
 ("Sapata corrida","Rasa","Cargas de parede/alinhadas","Idem, exige solo competente raso","NBR 6122"),
 ("Sapata associada/alavancada","Rasa","Pilares na divisa ou muito próximos","Exige viga de equilíbrio bem dimensionada","NBR 6122"),
 ("Radier","Rasa","Carga distribuída / solo raso uniforme fraco","Sensível a recalque diferencial; projeto cuidadoso","NBR 6122"),
 ("Bloco de fundação","Rasa","Cargas menores, concreto simples","Limitado a cargas/solos favoráveis","NBR 6122"),
 ("Estaca pré-moldada (cravada)","Profunda","Boa quando não há restrição de trepidação","Trepidação/ruído; vizinhança sensível","NBR 6122"),
 ("Estaca hélice contínua","Profunda","Produtividade, sem bate-estaca","Exige controle de execução/injeção","NBR 6122"),
 ("Estaca escavada","Profunda","Sem impacto; cargas variadas","Controle de furo; NA pode exigir cuidado","NBR 6122"),
 ("Estaca Strauss","Profunda","Cargas menores, equipamento simples","Limites de carga/comprimento; NA","NBR 6122"),
 ("Estaca Franki","Profunda","Boa capacidade de ponta","Trepidação; vizinhança sensível","NBR 6122"),
 ("Estaca raiz","Profunda","Espaço confinado, reforço, acesso restrito","Custo; execução especializada","NBR 6122"),
 ("Estaca metálica","Profunda","Cravação com controle, cargas altas","Custo do aço; proteção à corrosão","NBR 6122"),
 ("Tubulão a céu aberto","Profunda","Cargas altas sem NA elevado","NA alto inviabiliza / exige ar comprimido","NBR 6122"),
 ("Tubulão a ar comprimido","Profunda","Cargas altas com NA","Segurança do trabalho sob ar comprimido","NBR 6122 / NR"),
]
for i,row in enumerate(linhas):
    for j,val in enumerate(row):
        cell=wc.cell(row=3+i,column=1+j,value=val); cell.border=border; cell.font=f_norm; cell.alignment=left
        if (3+i)%2==0: cell.fill=fill_c2
        if j==1: cell.fill=(fill_rasa if val=="Rasa" else fill_prof)
for w,c in [(26,"A"),(10,"B"),(34,"C"),(30,"D"),(12,"E")]:
    wc.column_dimensions[c].width=w
wc["A18"]="Referência de triagem — não substitui o projeto de fundações. Revisado e assinado por Gustavo Domingos, CREA-PR 140.964-D."
wc["A18"].font=f_small; wc.merge_cells("A18:E18")

# ---------- DASHBOARD ----------
wd=wb.create_sheet("Dashboard"); wd.sheet_view.showGridLines=False
wd["A1"]="DASHBOARD — Triagem de Fundações"; wd["A1"].font=f_tit; wd["A1"].fill=fill_v
wd.merge_cells("A1:E1"); wd.row_dimensions[1].height=26; wd["A1"].alignment=Alignment(horizontal="left",vertical="center")
def metric(lc,vc,label,formula,fill):
    wd[lc]=label; wd[lc].font=f_lbl; wd[lc].border=border; wd[lc].alignment=left
    wd[vc]=formula; wd[vc].font=Font(name="Georgia",size=18,bold=True,color=VERDE); wd[vc].alignment=center; wd[vc].fill=fill; wd[vc].border=border
metric("A3","A4","Casos analisados",'=COUNTA(Seletor!B3:B102)',fill_c2)
metric("B3","B4","RASA",'=COUNTIF(Seletor!H3:H102,"RASA")',fill_rasa)
metric("C3","C4","PROFUNDA",'=COUNTIF(Seletor!H3:H102,"PROFUNDA")',fill_prof)
metric("D3","D4","ZONA CINZENTA",'=COUNTIF(Seletor!H3:H102,"ZONA CINZENTA")',fill_cinza)
wd["A6"]=('Como usar: preencha o Seletor (uma linha por apoio/situação). Família, tipos candidatos e alerta '
 'são calculados a partir dos Parametros. TODA escolha é uma triagem — a decisão e o dimensionamento finais '
 'são do projetista de fundações (NBR 6122).')
wd["A6"].font=f_small; wd.merge_cells("A6:E8"); wd["A6"].alignment=left
wd["A10"]="Revisado e assinado por Gustavo Domingos — Engenheiro Civil, CREA-PR 140.964-D"
wd["A10"].font=Font(name="Calibri",size=9,bold=True,color=DOUR)
for w,c in [(16,"A"),(12,"B"),(12,"C"),(14,"D"),(10,"E")]: wd.column_dimensions[c].width=w

out=os.path.abspath(os.path.join(os.path.dirname(__file__),"..","04-curso-fundacoes","kit","planilha","planilha-fundacoes.xlsx"))
wb.save(out); print("PLANILHA GERADA:",out)
