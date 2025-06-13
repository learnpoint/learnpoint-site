---
layout: help-page-layout.html
title: Betyg / Skalor
description: Betyg / Skalor - Learnpoint Hjälp och Support
robots: noindex
next: "LIA / Inledning"
next_url: /help/internship/introduction.html
---

<h1>
    <span lang="sv">Skalor</span>
    <span lang="en">Scales</span>
</h1>

<!-- only-in-swedish.html -->

Skoladministratörer kan definiera vilka betygsskalor som ska kunna användas för kurser och kursdelar. Man kan ha olika skalor för olika kurser, vilket är särskilt användbart för skolor med olika utbildningsformer.


## Lägg till ny skala

1. Klicka på `Ny skala` under rubriken `Skalor för kurser` eller `Skalor för kursdelar`, beroende på vilken typ av skala du vill skapa.
2. Fyll i namnet på skalan.
3. Klicka på `Skapa`:

<!-- desktop-recording.html, { src: "_assets/create-scale.mp4", alt: "Skapa sny skala", theme: "light" } -->


## Redigera skala

1. Navigera till skalan som du vill redigera.
2. Klicka på meny-ikonen (dom tre prickarna till höger).
3. Klicka på `Redigera`:

<!-- desktop-screenshot.html, { src: "_assets/edit-scale.png", alt: "Redigera skala", theme: "light" } -->


## Skalans egenskaper

Varje skala har ett antal egenskaper som påverkar var den kan användas och hur den visas.

* *Namn*: Namnet är det som kommer att visas när man väljer vilken skala som ska användas för en kurs eller en kursdel.
* *Beskrivning*: Skalans interna beskrivning (syns endast för administratörer).
* *Skolformer*: Anger vilka skolformer skalan ska kunna användas för. En kurs tillhör alltid en skolform, så se till att skalan är aktiv för den skolform som kursen tillhör.
* *Lägsta värde för status klar*: Anger det lägsta värde ett betygssteg måste ha för att den gröna status-ikonen skall visas.


## Lägg till steg

Varje skala har ett antal betygssteg. När en lärare sätter betyg, så är det dessa steg/betyg som hon kan välja bland.

1. Klicka på `Nytt steg` under rubriken `Betygssteg`
2. Fyll i stegets egenskaper:

<!-- desktop-recording.html, { src: "_assets/create-grading-step.mp4", alt: "Lägga till betygssteg", theme: "light" } -->


## Stegens egenskaper

Varje betygssteg har följande egenskaper:

* *Namn*: Stegets fullständiga namn.
* *Förkortning*: Förkortningen är det som visas vid betygssättning, i översikten, och i studieplanen.
* *Värde*: Om värdet är större än lägsta värde för status klar, så visas en grön status-ikon. Om värdet är lägre, så visas en röd ikon.
* *Status*: Visar den aktuella status-ikonen för steget.

*TIPS*: Betygsstegen uttrycks ofta med bokstäver, men det är också möjligt att använda emojis, vilket kan vara användbart i vissa situationer. Här är ett exempel på hur det kan se ut när man betygssätter med en skala som har två emojis, ett rött kryss och en grön bock:

<!-- desktop-screenshot.html, { src: "_assets/grading-steps.png", alt: "Emojis i betygssteg", theme: "light" } -->


## Ta bort steg

Man kan endast ta bort betygssteg som aldrig använts för betygssättning. Så fort en lärare satt ett betyg utifrån ett betygssteg, så går det inte att ta bort det steget.

1. Klicka på ta bort-ikonen (papperskorgen till höger):

<!-- desktop-screenshot.html, { src: "_assets/remove-grading-step.png", alt: "Ta bort betygssteg", theme: "light" } -->


## Publicera skala

För att en skala ska kunna användas så behöver den publiceras. Och för att kunna publiceras, så behöver den ha minst ett betygssteg och dessutom vara aktiv för minst en skolform.

1. Klicka på meny-ikonen (dom tre prickarna till höger).
2. Klicka på `Publicera`:

<!-- desktop-screenshot.html, { src: "_assets/publish-scale.png", alt: "Publicera skala", theme: "light" } -->


## Flytta skalor

Skalorna kan flyttas så att dom hamnar i rätt ordning.

1. Klicka på meny-ikonen (dom tre prickarna till höger).
2. Nu visas knappar som indikerar vart du kan flytta skalan.
3. Klicka på någon av knapparna för att flytta upp eller ned:

<!-- desktop-recording.html, { src: "_assets/move-scales.mp4", alt: "Flytta skala", theme: "light" } -->


## Inaktivera en skala

Om en skala inte ska användas längre, så kan den inaktiveras. Detta påverkar givetvis inte dom kurser där skalan redan används — när en skala inaktiveras så kommer den bara döljas för nya kurser, samt för dom kurser där skalan inte redan används.

1. Klicka på skalan som du vill inaktivera.
2. Klicka på menyikonen (dom tre prickarna till höger) och välj `Redigera`.
3. Ta bort krysset för den skolform där skalan skall inaktiveras.
4. Klicka på `Spara`:

<!-- desktop-recording.html, { src: "_assets/deactivate-scale.mp4", alt: "Inaktivera en skala", theme: "light" } -->


## Ta bort skala

Notera att det endast är skalor som aldrig använts som är möjliga att ta bort.

1. Klicka på meny-ikonen (dom tre prickarna till höger).
2. Klicka på `Ta bort`:

<!-- desktop-screenshot.html, { src: "_assets/remove-scale.png", alt: "Ta bort skala", theme: "light" } -->
