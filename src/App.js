import './App.css';
import {Quote} from './models/Quote.js';
import {CitationError} from './models/CitationError.js';
import {DocumentError} from './models/DocumentError.js';
import {MLAWorksCitation} from './models/MLAWorksCitation.js';
import {useState} from 'react';

function App() {
  
  let documentErrorList;
  let dataEntriesList;
  let citationsErrorList;
  let worksCitedList;
  let startOfPaperIndex;
  let sectionWorksCited;
  const [selectedFormat, setSelectedFormat] = useState("MLA");
  
  const firstDoubleQuote_CharValues = [8220, 34];
  const lastDoubleQuote_CharValues = [8221, 34];
  // 33: !    46: .    59: ;    63: ?
  
  // Need Valid MLA inline-citation
  
  function numberOfNumbers(string) {
    let numberTotal = 0;
    for (let i = 0; i < string.length; i++) {
      if (!isNaN(string[i])) {
        numberTotal += 1;
      }
    }
    
    return numberTotal;
  }
  
  function hasNumber(string) {
    return /\d/.test(string);
  }
  
  function selectedFormatHandler(e) {
    e.preventDefault();
    
    let value = document.getElementById("selectedFormat").value;
    
    if (value !== selectedFormat) {
      if (selectedFormat === "MLA") {
        setSelectedFormat("APA");
      } else {
        setSelectedFormat("MLA");
      }
    }
  }
  
  function inputTextOnChange(e) {
    e.preventDefault();
    
    const responseImportant = document.getElementById("responseImportant");
    if (responseImportant.innerHTML === "Copy and paste your text here") {
      responseImportant.innerHTML = "Click Check Paper!";
      responseImportant.style.backgroundColor = "#ff006a";
    }
  }
  
  function inputTextChangeOnBlur(e) {
    e.preventDefault();
    
    let inputText = document.getElementById("inputText").value;
    
    if (inputText.length === 0) {
      const responseImportant = document.getElementById("responseImportant");
      responseImportant.innerHTML = "Copy and paste your text here";
      responseImportant.style.backgroundColor = "transparent";
    }
  }
  
  function inputTextChangeOnFocus(e) {
    e.preventDefault();
    
    const responseImportant = document.getElementById("responseImportant");
    if (responseImportant.innerHTML !== "See results below") {
      responseImportant.style.backgroundColor = "#ff006a";
    }
  }
  
  function clearTextArea(e) {
    e.preventDefault();
    
    document.getElementById("inputText").value = "";
    const responseImportant = document.getElementById("responseImportant");
    responseImportant.innerHTML = "Copy and paste your text here";
    responseImportant.style.backgroundColor = "transparent";
  }
  
  function stripQuotations(quote) {
    if (firstDoubleQuote_CharValues.includes(quote.charCodeAt(0))) {
      quote = quote.substring(1);
    }
    if (lastDoubleQuote_CharValues.includes(quote.charCodeAt(quote.length -1))) {
      quote = quote.substring(0, (quote.length -1));
    }
    quote.replace("\"", "");
    
    return quote;
  }
  
  function addToCitationErrorList(citation, secIndex, index, errorMessage) {
    let citationObject;
    
    for (let i = 0; i < citationsErrorList.length; i++) {
      let citationToCheck = citationsErrorList[i].getCitation();
      
      if (citation === citationToCheck) {
        citationObject = getCitationObject(citation);
        let citationErrors = citationObject.getCitationErrors();
        
        if (citationErrors === undefined) {
          citationErrors = [];
        }
        
        citationErrors.push("This citation already exists.");
        citationObject.setCitationErrors(citationErrors);
        break;
      }
    }
  
    if (citationObject === undefined) {
      citationObject = new CitationError(citation);
      let citationErrors = [errorMessage];
      citationObject.setCitationErrors(citationErrors);
      citationObject.setCitationIndex(index);
      citationObject.setCitationSection(secIndex);
    }
    
    citationsErrorList.push(citationObject);
  }
  
  function addCitationError(quote, citation, secIndex, index, errorMessage) {
    quote = stripQuotations(quote);
    let quoteObject;
    
    /* If this is a citation for a quote */
    for (let i = 0; i < dataEntriesList.length; i++) {
      let quoteToCheck = dataEntriesList[i].getQuote();
      
      if (quote === quoteToCheck) {
        quoteObject = getQuoteObject(quote);
        let citationToCheck = quoteObject.getCitation();
        let citationErrors = quoteObject.getCitationErrors();
        
        if (citationErrors === undefined) {
          citationErrors = [];
        }
        
        if (citation === citationToCheck) {
          citationErrors.push("This citation already exists for given quote.");
          // What about errorMessage here?
          
        } else {
          citationErrors.push(errorMessage);
          
        }
        
        quoteObject.setCitationErrors(errorMessage);
        dataEntriesList.push(quoteObject);
        return;
      }
    }
    
    if (quoteObject === undefined) {
      console.log("Could not add citation error to quotes list.");
    }
    
  }
  
  /* For now, there should only be one quote per citation! This will flip some time soon*/
  function addCitation(quote, citation, secIndex, index) {
    quote = stripQuotations(quote);
    let quoteObject = undefined;
    
    for (let i = 0; i < dataEntriesList.length; i++) {
      let quoteToCheck = dataEntriesList[i].getQuote();
      
      if (quote === quoteToCheck) {
        quoteObject = getQuoteObject(quote);
        let citationStr = quoteObject.getCitation();
        
        if (citationStr === undefined) {
          quoteObject.setCitation(citation);
          quoteObject.setCitationIndex(index);
          quoteObject.setCitationSection(secIndex);
          
        } else {
          quoteObject.setCitationError("This Citation exists at least twice for the quote in this paper.");
          addCitationError(quote, citation, secIndex, index);
        }
        
        dataEntriesList.push(quoteObject);
        break;
      }
    }
    
    if (quoteObject === undefined) { // If quote does not exists with given citation.
      let citationHasErrors = false;
      
      for (let i = 0; i < citationsErrorList.length; i++) { // Checking to see if has errors
        let citationToCheck = citationsErrorList[i].getCitation();
        
        if (citation === citationToCheck) {
          citationHasErrors = true;
          let citationObject = getCitationObject(citation);
          console.log(citationObject);
          let citationErrors = citationObject.getCitationErrors();
          
          if (citationErrors === undefined) {
            citationErrors = [];
          }
          citationErrors.push("This citation is not associated with any quote/block quote.");
          citationObject.setCitationErrors(citationErrors);
          citationsErrorList.push(citationObject);
          break;
        }
      }
      
      if (!citationHasErrors) {
        let citationObject = new CitationError(citation);
        citationsErrorList.push(citationObject);
      }
    }
    
  }
  
  function getCitationObject(citation) {
    let citationObject;
    
    for (let i = 0; i < citationsErrorList.length; i++) {
      let citationToCheck = citationsErrorList[i].getCitation();
      
      if (citation === citationToCheck) {
        citationObject = citationsErrorList.splice(i, 1);
        citationObject = citationObject[0];
        break;
      }
    }
    return citationObject;
  }
  
  function getQuoteObject(quote) {
    quote = stripQuotations(quote);
    let quoteObject;
    
    for (let i = 0; i < dataEntriesList.length; i++) {
      let quoteToCheck = dataEntriesList[i].getQuote();
      
      if (quote === quoteToCheck) {
        quoteObject = dataEntriesList.splice(i, 1); //Removes the quoteObj from list.
        quoteObject = quoteObject[0];
        
        break;
      }
    }
    return quoteObject;
  }
  
  function addQuote(quote, secIndex, index) {
    quote = stripQuotations(quote);
    let quoteObject;
    
    for (let i = 0; i < dataEntriesList.length; i++) {
      let quoteToCheck = dataEntriesList[i].getQuote();
      
      if (quote === quoteToCheck) {
        quoteObject = getQuoteObject(quote);
        let quoteErrors = quoteObject.getQuoteErrors();
        
        if (quoteErrors === undefined) {
          quoteErrors = [];
        }
        
        quoteErrors.push("This quote already exists in this document");
        quoteObject.setQuoteErrors(quoteErrors);
        break;
      }
    }
    
    if (quoteObject === undefined) {
      quoteObject = new Quote(quote);
      let quoteErrors = [];
      
      quoteObject.setQuoteErrors(quoteErrors);
      quoteObject.setQuoteIndex(index);
      quoteObject.setQuoteSection(secIndex);
    }
    
    dataEntriesList.push(quoteObject);
  }
  
  function addQuoteError(quote, errorMessage) {
    quote = stripQuotations(quote);
    
    let quoteObject = getQuoteObject(quote);
    
    if (quoteObject === undefined) {
      console.log("SYSTEM ERROR: Cannot add error to a quote that does not exist");
      return undefined;
    }
    
    let quoteErrors = quoteObject.getQuoteErrors();
    if (quoteErrors === undefined) {
      quoteErrors = [];
    }
    
    quoteErrors.push(errorMessage);
    quoteObject.setQuoteErrors(quoteErrors);
    
    dataEntriesList.unshift(quoteObject);
  }
  
  function addDocumentError(errorMessage, type, secIndex, index) {
    let documentErrorObject = new DocumentError(errorMessage, type, secIndex, index);
    documentErrorList.push(documentErrorObject);
  }
  
  function removeMlaDecimal(word) {
    const chars = word.split('');
    if (chars[(word.length-1)] === '.') { // If the last character is a decimal, remove it!
      const result = word.slice(0, -1);
      return result;
    } else {
      return word;
    }
  }
  
  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  /** This should check that an author's name appears in here! Author must come from Works Cited list*/
  function validateCitationInText(wordsInSection, citation) {
    // DO NOT disable the comment below...
    // eslint-disable-next-line
    let sentences = wordsInSection.join(" ").match( /[^\.!\?]+[\.!\?]+/g );
    
    let sentencesWithQuotationCitation = [];
    // console.log("Citation to check: " +citation);
    
    for (let sentenceIndex = 0; sentenceIndex < wordsInSection.length; sentenceIndex++) {
      let sentence = sentences[sentenceIndex];
      let hasBeginningQuoteInSentence = false;
      let hasEndingQuoteInSentence = false;
      
      if (sentence === undefined) {
        continue;
      }
      
      for (let i = 0; i < sentence.length; i++) {
        let character = sentence[i];
        
        if (!hasBeginningQuoteInSentence && firstDoubleQuote_CharValues.includes(character.charCodeAt(0))) {
          hasBeginningQuoteInSentence = true;
          
        } else if (!hasEndingQuoteInSentence && lastDoubleQuote_CharValues.includes(character.charCodeAt(0))) {
          hasEndingQuoteInSentence = true;
          // console.log("Sentence: "+sentence);
          break;
          
        }
        
      }
      
      if (hasBeginningQuoteInSentence) {
        sentencesWithQuotationCitation.push(sentence);
        // console.log("Has beginning quote! " +sentencesWithQuotationCitation.join(" "));
        // console.log(sentencesWithQuotationCitation.join(" ").includes(citation));
      
        if (hasEndingQuoteInSentence) { // IF IT HAS ENDING QUOTATION MARKS, THE CITATION MUST EXIST AFTER QUOTE!
          // console.log("Quote found! " +sentencesWithQuotationCitation.join(" "));
          return true;
        }
      }
    }
    return false;
  }
  
  function findMlaBlockCitation(wordsInSection, secIndex) {
    
    if (wordsInSection.join(" ").includes(")") && wordsInSection.join(" ").includes("(")) { // Checks if the section contains a parenthesis. Possible block citation!
      console.log(wordsInSection);
      let citation = [];
      let quote = [];
      let i = 0;
      let startedCitationIndex = 0;
    
      while (true) {
        let word = wordsInSection[i];
        
        citation = findMlaCitations(word, startedCitationIndex, i, citation);
        
        if (citation[0].includes(")") && citation[0].includes("(")) { // If citation was found
          addQuote(quote.join(" "), secIndex, 0);
          addCitation(quote.join(" "), citation.join(" "), secIndex, i);
          return true;
          
        } else if (!citation[0].includes("(")) {
          quote.push(word);
        } else if (citation[0].includes("(")) {
          citation.push(word);
        }
        
        i++;
      }
    }
    return false;
  }
  
  function findMlaCitations(word, startedCitationIndex, i, citation) {
    
    if (!word.includes("(") && (citation === undefined)) { // If beginning of citation and doesn't include open parenthesis.
      console.log("Citation does not come right after quote! WHOOPS");
      return [];
      
    } else if (word.includes("(") && (startedCitationIndex === i)) { // If citation is right after quote.
      
      if (word.includes(")")) { // If word is also end of citation too.
        const finalWord = removeMlaDecimal(word);
        citation.push(finalWord);
        return [citation.join(" ")];
      }
      citation.push(word);
      
    } else if (word.includes(")")) { // If this is the end of the citation.
      const finalWord = removeMlaDecimal(word);
      citation.push(finalWord);
      return [citation.join(" ")];
      
    } else {
      citation.push(word);
    }
    
    return [citation.join(" ")];
  }
  
  /**
   * Finds all of the quotes in MLA Format and adds them to the Quotes List! 
   */
  function findMlaQuotes(startingIndex, inputSections, sectionWorksCited) {
    
    for (let secIndex = startingIndex; secIndex < sectionWorksCited; secIndex++) {
      let currentSection = inputSections[secIndex].replace('\t', "");
      const wordsInSection = currentSection.split(" ");
      
      if (wordsInSection.length < 2) { // We don't want empty sections!
        continue;
      }
      
      let containsQuoteInSection = false;
      let containsCitationInSection = false;
      let hasQuoteErrorInSection = false;
      
      /* Time to find the quotes in a section*/
      for (let i = 0; i < wordsInSection.length; i++) {
        let word = wordsInSection[i];
        
        let containsQuote = false;
        let quote;
        let quoteErrors = [];
        let citationErrors = [];
        
        if (firstDoubleQuote_CharValues.includes(word.charCodeAt(0))) { // First quoted word found, now find the last.
          let wordsInQuote = [];
          wordsInQuote.push(word);
          let wordsinSectionLength = wordsInSection.length -1;
          let quoteIndex = i;
          
          while (true) { // Checking word with ending quotation marks!
            i++;
            word = wordsInSection[i];
            
            word = removeMlaDecimal(word);
            
            const containsFinalQuote = (lastDoubleQuote_CharValues.includes(word.charCodeAt(word.length -1)));
            wordsInQuote.push(word);
            
            if (containsFinalQuote) {
              containsQuoteInSection = true;
              containsQuote = true;
              break;
            } else if (word.includes("(")) { // If a citation comes before an ending parenthesis, tell the user.
              quoteErrors.push("Missing ending parenthesis. Is it possible that you missed one before the citation?");
              wordsInQuote.pop();
              hasQuoteErrorInSection = true;
              containsQuote = true;
              break;
            } else if (i === wordsinSectionLength) { // If this is the last word in the section and doesn't contain any quotes, tell the user.
              quoteErrors.push("Missing ending quotation marks!");
              hasQuoteErrorInSection = true;
              containsQuote = true;
              break;
            }
          }
          
          quote = wordsInQuote.join(" ");
          
          let startedCitationIndex = i+1;
          let containsCitation = false;
          let citation = [];
          let citationIndex = 0;
          let citationIndexFound = false;
          let citationRightAfterQuote = true;
          
          // Get the citing of the quote after the quotation marks.
          while (true) {
            i++;
            if (wordsInSection.length === i) {
              break;
            }
            word = wordsInSection[i];
            
            
            if (firstDoubleQuote_CharValues.includes(word.charCodeAt(0))) { // Could mean that this quote could be associated with the next quote?
              i--;
              break;
            }
            
            citation = findMlaCitations(word, startedCitationIndex, i, citation);
            
            /* If citation hasn't been found yet, give it the index now that it's found!*/
            if (!citationIndexFound && citation[0].includes("(")) {
              citationIndexFound = true;
              citationIndex = i;
              
              if (citation[0].includes(")")) { // If this citation is also the last one, break!
                containsCitationInSection = true;
                containsCitation = true;
                break;
              }
              
              continue;
            }
            
            if (citation[0].includes(")") && citation[0].includes("(")) { // If citation was found
              containsCitationInSection = true;
              containsCitation = true;
              break;
            }
            
            /* If the citation index isn't found yet and it's not the last word in the section, continue to next iteration*/
            if (containsQuote && !citationIndexFound && (i !== wordsInSection.length -1)) {
              citationRightAfterQuote = false;
              citation.splice(0, citation.length);
              continue;
            }
          }
          
          if (containsCitation) {
            citation = citation.join(" ");
          }
          
          /* If there's a quote where the citation doesn't come right after. Suggestion! */
          if (!citationRightAfterQuote && containsQuote) {
            citationErrors.push("Suggestion: Add citation directly after the quote.");
          }
          
          /* If there's a citation and a quote! */
          if (containsCitation && containsQuote) {
            
            addQuote(quote, secIndex, quoteIndex);
            addCitation(quote, citation, secIndex, citationIndex);
            
            // Validate citation
            let citationValid = validateCitationInText(wordsInSection, citation);
            if (!citationValid) {
              
            }
            
          } else if (containsCitation && !containsQuote) { // If there's only a citation
            addToCitationErrorList(citation, secIndex, citationIndex, "No quote exists for the given citation");
            
          } else if (!containsCitation && containsQuote) { // If there's only a quote
            // Could be a quote from different paragraph? Idk...
            console.log(citation);
            addQuote(quote, secIndex, quoteIndex);
            // let quoteLength = quote.length;
            // addCitationError(quote, )
            addQuoteError(quote, "This quote does not have an in-text citation");
          }
          
          if (containsQuote && quoteErrors !== undefined) {
            quoteErrors.forEach(error => {
              addQuoteError(quote, error);
            });
          }
          
          if (containsCitation && citationErrors !== undefined) {
            citationErrors.forEach(error => {
              addToCitationErrorList(citation, secIndex, citationIndex, error);
            });
          }
          
          //Repeat for multiple quotes/citations in paragraph.
        }
      }
    
      if (!containsQuoteInSection && !hasQuoteErrorInSection) { // If the section does not contain a quote in section or quote errors. Could it be a block citation?
        containsCitationInSection = findMlaBlockCitation(wordsInSection, secIndex);
      }
      
      if (containsQuoteInSection && !containsCitationInSection) { // This could possibly be a single cited paper!
        
      }
      
      if (!containsCitationInSection && !containsQuoteInSection) {
        addDocumentError("No quote or citation exists for this paragraph!", "Document Suggestion", secIndex, 0);
      }
    }
  }
  
  /**
  * Author, Title of source, Title of container, Other contributors
  * Version, Number, Publisher, Publication date, Location.
  */
  function findMlaWorksCited(sectionWorksCited, inputSections, totalNumberSections) {
    
    for (let secIndex = sectionWorksCited; secIndex < totalNumberSections; secIndex++) {
      let mlaWorksCitedObj = new MLAWorksCitation(inputSections[secIndex], secIndex);
      // DO NOT disable the comment below...
      // eslint-disable-next-line
      let sentences = inputSections[secIndex].match( /[^\.!\?]+[\.!\?]+/g );
      let sentenceIndex = 0;
      
      if (sentences === null) { // This is null instead of undefined because of the funky .match() function above.
        // This document error will move onto the next source!
        addDocumentError("Add your works citations at the end of the paper under the Works Cited section!", "Document Error", secIndex, 0);
        continue;
      }
      
      console.log(sentences);
      console.log(sentences.length);
      let inLoop = false;
      
      
      while (sentenceIndex < sentences.length-1) {
        console.log(inLoop);
        inLoop = true;
        console.log("Sentence Author sentence "+sentenceIndex);
        let wordsInSection = 0;
        
        /* Find Author and Author Acronym! */
        let authorSentence = sentences[sentenceIndex].trim();
        authorSentence = authorSentence.replace('.', "");
        
        let authorNames = authorSentence.split(",");
        let authorErrors = [];
        
        if (authorNames === undefined && secIndex === sectionWorksCited) { // If this is the first works cited source and there aren't any names... Return an error!
          addDocumentError("Add your works citations at the end of the paper under the Works Cited section!", "Document Error", secIndex, 0);
          continue;
        }
        
        mlaWorksCitedObj.setAuthorIndex(sentenceIndex);
        
        // console.log(authorNames);
        if (authorNames.length === 1) {
          mlaWorksCitedObj.setAuthor(authorNames[sentenceIndex]);
          authorErrors.push("Author name must include first and last name in the following format" +
          " 'Last Name, First Name (Optional: Middle Initial/Name).'");
        } else if (authorNames.length > 2) {
          mlaWorksCitedObj.setAuthor(authorSentence);
          authorErrors.push("Make sure to use the following format for the Author's name:" +
          " 'Last Name, First Name (Optional: Middle Initial/Name).'");
        } else {
          let lastNames = authorNames[0].trim().split(" ");
          let firstNames = authorNames[1].trim().split(" ");
          let fullname = [];
          
          firstNames.forEach(word => {
            fullname.push(capitalizeFirstLetter(word.toLowerCase()));
          });
          lastNames.forEach(word => {
            fullname.push(capitalizeFirstLetter(word.toLowerCase()));
          });
          
          mlaWorksCitedObj.setAuthor(fullname.join(" "));
          
          let authorAcronym = [];
          firstNames.forEach(word => {
            authorAcronym.push(word.charAt(0));
          });
          lastNames.forEach(word => {
            authorAcronym.push(word.charAt(0));
          });
          
          mlaWorksCitedObj.setAuthorAcronym(authorAcronym.join(""));
          console.log(authorAcronym.join(""));
        }
        
        if (authorErrors !== undefined) {
          let errors = mlaWorksCitedObj.getAuthorErrors();
          
          if (errors === undefined) {
            errors = [];
          }
          authorErrors.forEach(error => {
            errors.push(error);
          });
          
          mlaWorksCitedObj.setAuthorErrors(errors);
        }
        
        
        
        /* Title Source */
        wordsInSection += authorSentence.split(" ").length;
        sentenceIndex += 1;
        console.log("Sentence Title Source line " +sentenceIndex);
        let titleSourceSentence = sentences[sentenceIndex].trim();
        let titleSourceErrors = [];
        
        if (titleSourceSentence === undefined || titleSourceSentence.length < 2) {
          titleSourceErrors.push("Title Source should follow the author. Depending on" +
          " the type of source, it should be listed in italics or quotation marks.");
          mlaWorksCitedObj.setTitleSourceErrors(titleSourceErrors);
          break;
        }
        
        mlaWorksCitedObj.setTitleSource(titleSourceSentence);
        mlaWorksCitedObj.setTitleSourceIndex(wordsInSection);
        let isBookSource = false; // If it is quoted source, then it's a (1) Website (2) A Periodical (3) or Song piece. IF NOT, it's a book source.
        
        
        /* Possible quoted source? If not, then it should be italicized. */
        if (firstDoubleQuote_CharValues.includes(titleSourceSentence.charCodeAt(0)) && lastDoubleQuote_CharValues.includes(titleSourceSentence.charCodeAt(titleSourceSentence.length -1))) {
          titleSourceSentence = stripQuotations(titleSourceSentence);
          mlaWorksCitedObj.setTitleSource(titleSourceSentence);
          
        } else {
          isBookSource = true;
        }
        
        if (titleSourceErrors !== undefined) {
          mlaWorksCitedObj.setTitleSourceErrors(titleSourceErrors);
        }
        
        
        
        /* This is where it gets tricky. The Container could have a lot of information... */
        wordsInSection += titleSourceSentence.split(" ").length;
        sentenceIndex += 1;
        console.log("Sentence Title Container " +sentenceIndex);
        let containerErrors = [];
        let containerSentence = sentences[sentenceIndex];
        
        if (containerSentence === undefined) {
          containerErrors.push("Title Source Container must include where the source is located. For example: Title of container, contributors, version, number, publisher, publication date, and location.");
          mlaWorksCitedObj.setTitleContainerErrors(containerErrors);
          break;
        }
        
        containerSentence = containerSentence.trim();
        
        if (containerSentence === undefined || containerSentence.length < 2) {
          containerErrors.push("Title Source Container must include where the source is located.");
          mlaWorksCitedObj.setTitleContainerErrors(containerErrors);
          break;
        }
        
        mlaWorksCitedObj.setTitleContainerIndex(wordsInSection);
        mlaWorksCitedObj.setTitleContainer(containerSentence);
        let containerItems = containerSentence.split(",");
        let publisher;
        let publicationDate;
        let location;
        let contributors;
        let version;
        
        let containerMainSource;
        let containerDate;
        // let possibleBookSource = [];
        
        if (containerItems < 2) {
          containerErrors.push("You should include more items describing where your source came from. Include: website, articles, postings, and other works.");
          
        } else {
          containerMainSource = containerItems[0];
            
          for (let i = 1; i < containerItems; i++) {
            let item = containerItems[i];
            if (item.length === 0) {
              continue;
            }
            
            let itemLower = item.toLowerCase();
            console.log(itemLower);
            wordsInSection += item.length;
            if (item.length < 2) { // We don't want any poorly functioned comma-separated words.
              continue;
            }
            
            // If this is a url, then the first item in the container sentence should be the Container Title!!!
            if (item.includes("www.") || item.includes(".org") || item.includes(".edu") || item.includes(".com")
              || item.includes(".us") || item.includes(".gov") || item.includes("pp")) {
                
                location = item;
                mlaWorksCitedObj.setLocation(location);
                mlaWorksCitedObj.setLocationIndex(wordsInSection);
            } else if (itemLower.includes("accessed")) {
              continue;
              
            } else if (itemLower.includes("translated") || itemLower.includes("annotated") || itemLower.includes("edited")) {
              contributors = item;
              mlaWorksCitedObj.setContributors(contributors);
              mlaWorksCitedObj.setContributorsIndex(wordsInSection);
              
            } else if (itemLower.includes("ed.") || itemLower.includes("vol.") || itemLower.includes("no.") || itemLower.includes("authorized")) {
                version = item;
                mlaWorksCitedObj.setVersion(version);
                mlaWorksCitedObj.setVersionIndex(wordsInSection);
                
            } else if (hasNumber(item)) { // If this is a number, maybe it's a date of the source?
              
              if (itemLower.includes("jan") || itemLower.includes("feb") || itemLower.includes("mar") || itemLower.includes("apr") || itemLower.includes("may") ||
                itemLower.includes("jun") || itemLower.includes("jul") || itemLower.includes("aug") || itemLower.includes("sep") || itemLower.includes("oct") ||
                itemLower.includes("nov") || itemLower.includes("dec") || (numberOfNumbers(itemLower) >= 4)) {
                
                /* Container date stuff will be more complex, but for now, let's just save the date! */
                publicationDate = item;
                mlaWorksCitedObj.setPublicationDate(publicationDate);
                mlaWorksCitedObj.setPublicationDateIndex(wordsInSection);
                
              }
              
            } else if (item.length > 10) { // If it's nothing else, then it is probably the Publisher.
              publisher = item;
              mlaWorksCitedObj.setPublisher(publisher);
              mlaWorksCitedObj.setPublisherIndex(wordsInSection);
            }
            
          }
        
          if (containerMainSource === undefined) {
            containerErrors.push("You should include about where your source came from.");
          } else {
            // Add the main source to the 
          }
          
          // If there is no url, there are more than 2 items, AND there is a date.
          if (location === undefined && containerItems < 3 && containerDate !== undefined) {
            containerErrors.push("Suggestion: you may need to include more describing where your source came from.");
          }
          
          if (containerDate === undefined) {
            containerErrors.push("You must include a date!");
          }
          
          if (contributors === undefined) {
            containerErrors.push("Suggestion: Add contributors to the source if there are any.");
          }
          
          if (location === undefined && !isBookSource) {
            containerErrors.push("You must add a web url or location if this isn't a book source.");
          }
          
          if (publisher === undefined) {
            // containerErrors.push("Include the publisher which produces/distributes the source to the public.");
          }
          
          if (publicationDate === undefined) {
            containerErrors.push("You must include a publication date.");
          }
          
          if (version === undefined) {
            containerErrors.push("Suggestion: Include a version of the source if there is one.");
          }
          
        }
        
        /* Add any errors to the works cited page! Haha */
        if (containerErrors !== undefined) {
          mlaWorksCitedObj.setTitleContainerErrors(containerErrors);
        }
        
      }
      
      //comment
      // let mlaWorksCitedMissingItems = [];
      // let firstMissingItem = false;
      // /**
      // * If there are any items missing, add those to the MLA Works Cited Errors list! 
      // * There should be at least 8 sentences! Create an error for each sentence (item)
      // * that is missing from their works cited item!.
      // */
      
      sentenceIndex += 1;
      console.log(worksCitedList);
      worksCitedList.push(mlaWorksCitedObj);
      break;
    }
    
    
    if (worksCitedList[0] === undefined) {
      return false;
    }
    
    return true;
  }
  
  function insertCommentIntoArray(array, index, commentType, comment, wordLength) {
    if (array.length < 2) {
      array.push(index);
      array.push(commentType);
      array.push(comment);
      array.push(wordLength);
      return array;
    }
    
    for (let i = 0; i < array.length; i+=4) {
      let indexToCheck = array[i];
      
      if (index <= indexToCheck) {
        array.splice(i, 0, wordLength);
        array.splice(i, 0, comment);
        array.splice(i, 0, commentType);
        array.splice(i, 0, index);
        return array;
      }
    }
    
    array.push(index);
    array.push(commentType);
    array.push(comment);
    array.push(wordLength);
    return array;
  }
  
  /* Creates an array that holds indexes with errors/suggestions/correct statements for printing! */
  function createSectionsArray(totalNumberOfSections) {
    let sectionsArray = [];
    
    for (let sectionIndex = 0; sectionIndex < totalNumberOfSections; sectionIndex++) {
      let commentsArray = []; // The index & comment to the error!
      
      /* Documents List! */
      documentErrorList.forEach(documentErrorObj => {
        if (documentErrorObj.getSection() === sectionIndex) {
          let errorMessage = documentErrorObj.getError();
          let errorType = documentErrorObj.getType();
          
          commentsArray = insertCommentIntoArray(commentsArray, documentErrorObj.getIndex(), errorType, errorMessage, 0);
        }
      });
      
      /* Quotes/Citations List! */
      dataEntriesList.forEach(quoteObject => {
        // Quotes 
        if (quoteObject.getQuoteSection() === sectionIndex) {
          let quoteWordLength = quoteObject.getQuote().split(" ").length;
          let errors = quoteObject.getQuoteErrors();
          if (errors === undefined) { // There should always be quote errors... for some reason :D
            return;
          }
          
          if (errors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, quoteObject.getQuoteIndex(), "Correct Quotation", "Correct quote format!", quoteWordLength);
          } else {
            
            for (let i = 0; i < errors.length; i++) {
              let errorMessage = errors[i];
              let errorMesssageLower = errorMessage.toLowerCase();
              let messageType = "Invalid Quotation";
              console.log(errorMessage);
              
              if (errorMesssageLower.includes("suggestion")) {
                messageType = "Quotation Suggestion";
              }
              commentsArray = insertCommentIntoArray(commentsArray, quoteObject.getQuoteIndex(), messageType, errors[i], quoteWordLength);
            }
            
          }
        }
        
        
        // Citations
        if (quoteObject.getCitationSection() !== undefined && quoteObject.getCitationSection() === sectionIndex) {
          let citationWordLength = quoteObject.getCitation().split(" ").length;
          let errors = quoteObject.getCitationErrors();
          
          if (errors === undefined || errors.length < 1) { // If there aren't any errors
            commentsArray = insertCommentIntoArray(commentsArray, quoteObject.getCitationIndex(), "Correct Citation", "Correct Citation.", citationWordLength);
          } else {
            
            for (let i = 0; i < errors.length; i++) { // insert each error!
              let errorMessage = errors[i];
              let errorMesssageLower = errorMessage.toLowerCase();
              let messageType = "Citation Error";
              
              if (errorMesssageLower.includes("suggestion")) {
                messageType = "Citation Suggestion";
              }
              commentsArray = insertCommentIntoArray(commentsArray, quoteObject.getCitationIndex(), messageType, errors[i], citationWordLength);
            }
            
          }
        }
      });
      
      /* Citation Errors List! */
      citationsErrorList.forEach(citationError => {
        if (citationError.getCitationSection() === sectionIndex) {
          let errors = citationError.getCitationErrors();
          
          if (errors === undefined) {
            console.log("SYSTEM ERROR: citation error must include error message.");
            return;
          }
          for (let i = 0; i < errors.length; i++) {
            let errorMessage = errors[i];
            let errorMesssageLower = errorMessage.toLowerCase();
            let messageType = "Citation Error";
            
            if (errorMesssageLower.includes("suggestion")) {
              messageType = "Citation Suggestion";
            }
            
            let wordLength = citationError.getCitation().split(" ").length;
            commentsArray = insertCommentIntoArray(commentsArray, citationError.getCitationIndex(), messageType, errorMessage, wordLength);
          }
        }
      });
      
      /* Works Cited List! */
      worksCitedList.forEach(worksCitedObject => {
        if (worksCitedObject.getSectionIndex() === sectionIndex) {
          let authorErrors = worksCitedObject.getAuthorErrors();
          let titleSourceErrors = worksCitedObject.getTitleSourceErrors();
          let titleContainerErrors = worksCitedObject.getTitleContainerErrors();
          let contributorsErrors = worksCitedObject.getContributorsErrors();
          let versionErrors = worksCitedObject.getVersionErrors();
          let publisherErrors = worksCitedObject.getPublisherErrors();
          let publicationDateErrors = worksCitedObject.getPublicationDateErrors();
          let locationDateErrors = worksCitedObject.getLocationErrors();
          
          if (authorErrors === undefined || authorErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getAuthorIndex(), "Correct Author", "Correct Author format.", 0);
          } else {
            for (let i = 0; i < authorErrors.length; i++) {
              let error = authorErrors[i];
              let errorLower = error.toLowerCase();
              let errorType = "Invalid Author";
              
              if (errorLower.includes("suggestion")) {
                errorType = "Title Author";
              }
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getAuthorIndex(), errorType, error, worksCitedObject.getAuthorIndex());
            }
          }
          
          if (titleSourceErrors === undefined || titleSourceErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getTitleSourceIndex(), "Correct Title Source", "Correct Title Source format.", 0);
          } else {
            for (let i = 0; i < titleSourceErrors.length; i++) {
              let error = titleContainerErrors[i];
              let errorLower = error.toLowerCase();
              let errorType = "Invalid Title Name";
              
              if (errorLower.includes("suggestion")) {
                errorType = "Title Name Suggestion";
              }
              
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getTitleSourceIndex(), errorType, error, 0);
            }
          }
          
          if (titleContainerErrors === undefined || titleContainerErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getTitleContainerIndex(), "Correct Title Container", "Correct Title Container format.", 0);
          } else {
            for (let i = 0; i < titleContainerErrors.length; i++) {
              let error = titleContainerErrors[i];
              let errorLower = error.toLowerCase();
              let errorType = "Invalid Title Container";
              
              if (errorLower.includes("suggestion")) {
                errorType = "Title Container Suggestion";
              }
              
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getTitleContainerIndex(), errorType, error, 0);
            }
          }
          
          if (contributorsErrors === undefined || contributorsErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getContributorsIndex(), "Correct Contributors", "Correct Contributor format.", 0);
          } else {
            for (let i = 0; i < contributorsErrors.length; i++) {
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getContributorsIndex(), "Invalid Contributors", contributorsErrors[i], 0);
            }
          }
          
          
          if (versionErrors === undefined || versionErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getVersionIndex(), "Correct Version", "Correct Version format.", 0);
          } else {
            for (let i = 0; i < versionErrors.length; i++) {
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getVersionIndex(), "Invalid Version", versionErrors[i], 0);
            }
          }
          
          if (publisherErrors === undefined || publisherErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getPublisherIndex(), "Correct Publisher", "Correct Publisher format.", 0);
          } else {
            for (let i = 0; i < publisherErrors.length; i++) {
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getPublisherIndex(), "Invalid Publisher", publisherErrors[i], 0);
            }
          }
          
          if (publicationDateErrors === undefined || publicationDateErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getPublicationDateIndex(), "Correct Publication Date", "Correct Publicatoin Date format.", 0);
          } else {
            for (let i = 0; i < publicationDateErrors.length; i++) {
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getPublicationDateIndex(), "Invalid Publication Date", publicationDateErrors[i], 0);
            }
          }
          
          if (locationDateErrors === undefined || locationDateErrors.length < 1) {
            commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getLocationIndex(), "Correct Location", "Correct Location format.", 0);
          } else {
            for (let i = 0; i < locationDateErrors.length; i++) {
              commentsArray = insertCommentIntoArray(commentsArray, worksCitedObject.getLocationIndex(), "Invalid Location", locationDateErrors[i], 0);
            }
          }
          
        }
      });
      
      sectionsArray.push(commentsArray);
    }
    
    return sectionsArray;
  }
  
  function checkMlaHandler(e) {
    e.preventDefault();
    documentErrorList = [];
    citationsErrorList = [];
    dataEntriesList = [];
    worksCitedList = [];
    const includeCorrects = document.getElementById("includeCorrects").checked;
    const includeSuggestions = document.getElementById("includeSuggestions").checked;
    const includeInvalids = document.getElementById("includeInvalids").checked;
    
    const responseImportant = document.getElementById("responseImportant");
    responseImportant.innerHTML = "";
    
    const inputText = document.getElementById("inputText").value;
    
    if (inputText.length > 0) {
      responseImportant.style.backgroundColor = "#FF006A";
      // responseImportant.style.color = "#FFF";
    }
    
    let inputSections = inputText.split("\n");
    if (inputSections.length <= 1) {
      
      if (inputSections[0].length > 1) {
        responseImportant.innerHTML = "Make sure you've copied your whole paper before checking! " +
        "Include the following headers: Full Name, Teacher, Class Name, Today's Date.";
        return;
      }
      
      responseImportant.innerHTML = "Copy and paste your paper to start!";
      return;
    }

    /* Parse the headers! */
    let hasExtraLinesInHeaders = false;
    let hasMissingHeaders = false;
    let startParsingIndex = 0;
    let inputHeaders = [];
    for (let i = 0; i < inputSections.length; i++) {
      
      if (inputSections[i].length < 1) {
        hasExtraLinesInHeaders = true;
        inputSections.splice(i, 1);
        i--;
      } else if (inputSections[i].length > 15) {
        hasMissingHeaders = true;
        break;
      } else {
        inputHeaders.push(inputSections[i]);
      }
      
      if (inputHeaders !== undefined && inputHeaders.length === 4) {
        break;
      }
    }

    /* Input Headers handling!! */
    if (inputHeaders === undefined) {
      responseImportant.innerHTML = "his paper is empty";
      return;
    } else if (inputHeaders.length < 4) {
      addDocumentError("Missing headers! Headers must include: your name, your teacher's name, class name, and current date.", "Document Error", 0, 0);
    }
    if (hasExtraLinesInHeaders) {
      addDocumentError("Consider removing the extra lines between headers of your document.", "Document Suggestion", 0, 0);
    }
    if (hasMissingHeaders) {
      addDocumentError("Header/Title is missing! Headers must include: your name, your teacher's name, class name, and current date." +
      "If your title is over 15 words long, shorten it and click the Check Citation button again.", "Document Error", 0, 0);
    }
    
    /* Parse up until the Title! */
    let inputTitle;
    let hasExtraLinesBeforeTitle = false;
    for (let i = inputHeaders.length; i < inputSections.length; i++) {
      
      if (inputSections[i].length < 2) {
        hasExtraLinesBeforeTitle = true;
        inputSections.splice(i, 1);
        i--;
      } else {
        inputTitle = inputSections[i];
        startParsingIndex = i+1;
        break;
      }
    }
    
    /* Title Handling */
    if (inputTitle === undefined) {
      responseImportant.innerHTML = "Please add more to your paper before checking!";
      return;
    }
    if (inputSections[startParsingIndex].length < 2 || hasExtraLinesBeforeTitle) {
      addDocumentError("Consider removing the extra lines before and after the Title of your document.", "Document Suggestion", startParsingIndex -1, 0);
    }
    
    /* Parse the extra lines after the Title! We don't want to use them :) */
    for (let i = startParsingIndex; i < inputSections.length; i++) {
      if (inputSections[i].length < 2) {
        inputSections.splice(i, 1);
        i--;
      }
    }
    
    /* Removing any extra lines in the document.*/
    startOfPaperIndex = undefined;
    for (let i = 0; i < inputSections.length; i++) {
      if (inputSections[i].length < 2) {
        inputSections.splice(i, 1);
        i--;
      } else if (startOfPaperIndex === undefined && inputSections[i].split(" ").length > 20) {
        startOfPaperIndex = i;
        break;
      }
    }
    
    if (startOfPaperIndex === undefined) {
      responseImportant.innerHTML = "Please add more to your paper before checking!";
      return;
    }
    
    sectionWorksCited = undefined; 
    /* Give the section works cited the last section so the loop can work. */
    for (let i = startParsingIndex; i < inputSections.length; i++) {
      let text = inputSections[i].trim().split(" ");
      if (text.length === 2) {
        text = text.join(" ").toLowerCase();
        if (text === "works cited" || text === "references" || text === "bibliography") {
          sectionWorksCited = i;
        }
      }
    }
    
    if (sectionWorksCited === undefined) {
      sectionWorksCited = inputSections.length;
      responseImportant.innerHTML = "Please include a works cited page at the end of your document. If your works cited page exists," +
      " make sure to have a single line named 'Works Cited' before the citations";
      return;
    }
    
    /* Check for MLA Works Cited page and parse the works cited citations!*/
    let hasWorksCitedCitations = false;
    if (sectionWorksCited < inputSections.length) {
      hasWorksCitedCitations = findMlaWorksCited(sectionWorksCited+1, inputSections, inputSections.length);
    }
    
    if (!hasWorksCitedCitations) {
      responseImportant.innerHTML = "Add your source citations under your 'Works Cited' section at the end of the document.";
      return;
    }
    
    // console.log(inputSections);
    // console.log(startOfPaperIndex, sectionWorksCited);
    
    /* Now find the in-text quotes/citations inside the paper sections!*/
    findMlaQuotes(startOfPaperIndex, inputSections, sectionWorksCited);
    
    /* Check that citations alone are valid */
    
    
    // console.log(dataEntriesList);
    // console.log(citationsErrorList);
    // console.log(worksCitedList);
    // console.log(documentErrorList);
    
    
    const sectionArrayObject = createSectionsArray(inputSections.length);
    // console.log(sectionArrayObject);
    
    generateResultPaper(sectionArrayObject, inputSections, includeCorrects, includeSuggestions, includeInvalids);
    
    console.log("\nEND\n\n");
    responseImportant.innerHTML = "See results below";
    responseImportant.style.backgroundColor = "#3CD604";
  }
  
  function generateResultPaper(sectionArrayObject, inputSections, includeCorrects, includeSuggestions, includeInvalids) {
        /* Creating container for parent node */
    const parent = document.getElementById("bottom-parent");
    parent.innerHTML = ''; // Clear previous results!
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("container-other");
    
    /* Creating side comment column nodes */
    // const leftColumnNode = document.createElement("div");
    // leftColumnNode.classList.add("container-other");
    // leftColumnNode.classList.add("left-column");
    const rightColumnNode = document.createElement("div");
    // rightColumnNode.classList.add("container-other");
    rightColumnNode.classList.add("right-column");
    
    
    /* Creating results container so text nodes can be appended inside of the container */
    const resultTitle = document.createElement("h1");
    const resultTitleText = document.createTextNode("Results");
    resultTitle.appendChild(resultTitleText);
    resultsContainer.appendChild(resultTitle);
    
    
    let commentNumber = 1;
    /* Start creating the paper! parent -> resultsContainer -> text */
    for (let secIndex = 0; secIndex < inputSections.length; secIndex++) {
      const wordsInSection = inputSections[secIndex].split(" ");
      const sectionNode = document.createElement("p");
      
      const sectionArrayComments = sectionArrayObject[secIndex];
      const commentNumOfItems = sectionArrayComments.length;
      
      if (secIndex >= startOfPaperIndex && secIndex < sectionWorksCited) { // To tab paragraphs!
        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        sectionNode.appendChild(tabNode);
      }
      
      let commentWordLength = 0;
      let commentSpanNode;
      let hasCommentHighlight = false;
      for (let i = 0; i < wordsInSection.length; i++) {
        const word = wordsInSection[i];
        // const spanNode = document.createElement("span");
        const wordNode = document.createTextNode(word);
        
        for (let commentIndex = 0; commentIndex < commentNumOfItems; commentIndex+=4) {
          
          if (i === sectionArrayComments[commentIndex]) {
            // console.log(secIndex + " " + sectionArrayComments[commentIndex]);
            const commentType = sectionArrayComments[commentIndex+1];
            const commentTypeLower = commentType.toLowerCase();
            
            /* Checking whether or not to post based on user input checkboxes. */
            if (!includeCorrects && commentTypeLower.includes("correct")) {
              continue;
            }            
            if (!includeSuggestions && commentTypeLower.includes("suggestion")) {
              continue;
            }            
            if (!includeInvalids && commentTypeLower.includes("invalid")) {
              continue;
            }
            
            /** Determines how to highlight the text in the paper*/
            if (commentWordLength === 0 && !hasCommentHighlight) {
              hasCommentHighlight = true;
              commentWordLength = sectionArrayComments[commentIndex + 3];
              commentSpanNode = document.createElement("span");
              
              if (commentTypeLower.includes("error") || commentTypeLower.includes("invalid")) {
                commentSpanNode.classList.add("red-color");
              } else if (commentTypeLower.includes("correct")) {
                commentSpanNode.classList.add("green-color");
              } else if (commentTypeLower.includes("suggestion")) {
                commentSpanNode.classList.add("yellow-color");
              }
            }
            
            const commentNumberNode = document.createTextNode(commentNumber);
            const numberElement = document.createElement("span");
            
            if (commentTypeLower.includes("error") || commentTypeLower.includes("invalid")) {
              numberElement.classList.add("red-number");
            } else if (commentTypeLower.includes("correct")) {
              numberElement.classList.add("green-number");
            } else if (commentTypeLower.includes("suggestion")) {
              numberElement.classList.add("yellow-number");
            }
            
            numberElement.appendChild(commentNumberNode);
            sectionNode.appendChild(numberElement);
            let spaceNode3 = document.createTextNode(" ");
            sectionNode.appendChild(spaceNode3);
            
            
            /** USE #2
            * Create this or the textnodes/nodes from above will be placed over the nodes below in the Paper! 
            */
            const containerHeader = document.createElement("div");
            containerHeader.classList.add("side-container-header");
            
            /* Determining the underline container color! */
            const headerUnderline = document.createElement("span");
            headerUnderline.classList.add("under-line");
            
            if (commentTypeLower.includes("error") || commentTypeLower.includes("invalid")) {
              headerUnderline.classList.add("red-line");
            } else if (commentTypeLower.includes("correct")) {
              headerUnderline.classList.add("green-line");
            } else if (commentTypeLower.includes("suggestion")) {
              headerUnderline.classList.add("yellow-line");
            }
            
            /* Determining number to place in the header container!*/
            const commentNumberNode2 = document.createTextNode(commentNumber);
            const numberElement2 = document.createElement("span");
            
            if (commentTypeLower.includes("error") || commentTypeLower.includes("invalid")) {
              numberElement2.classList.add("red-number");
            } else if (commentTypeLower.includes("correct")) {
              numberElement2.classList.add("green-number");
            } else if (commentTypeLower.includes("suggestion")) {
              numberElement2.classList.add("yellow-number");
            }
            
            numberElement2.appendChild(commentNumberNode2);
            
            /* Comment Type Node */
            const commentTypeTextNode = document.createTextNode(commentType);
            const commentTypeElement = document.createElement("h2");
            commentTypeElement.append(commentTypeTextNode);
            
            /* Comment Message Node */
            const commentMessageText = sectionArrayComments[commentIndex+2];
            const commentMessageTextNode = document.createTextNode(commentMessageText);
            const commentMessageNode = document.createElement("p");
            commentMessageNode.appendChild(commentMessageTextNode);
            
            /* Comment Container Node */
            const commentContainerNode = document.createElement("div");
            commentContainerNode.classList.add("side-container");
            
            /** Append comment number and type Comment Header div.
            * Then append Comment Header div to Comment Container div.
            */
            containerHeader.appendChild(numberElement2);
            containerHeader.appendChild(commentTypeElement);
            commentContainerNode.appendChild(containerHeader);
            commentContainerNode.appendChild(headerUnderline);
            commentContainerNode.appendChild(commentMessageNode);
            
            /* If comment number is even, append it to right side. Else, left side.*/
            // if (commentNumber % 2 === 0) {
            //   rightColumnNode.appendChild(commentContainerNode);
            // } else {
            //   leftColumnNode.appendChild(commentContainerNode);
            // }
            
            rightColumnNode.appendChild(commentContainerNode);
            
            
            commentNumber += 1;
          }
        }
        
        /* If there is a comment associated with the word, make sure the word is added to a highlighted span */
        if (commentWordLength > 0) {
          commentWordLength -= 1;
          
          commentSpanNode.appendChild(wordNode);
          const spaceNode2 = document.createTextNode(" ");
          commentSpanNode.appendChild(spaceNode2);
          
          /* If this is the last word in the highlight. */
          if (commentWordLength === 0) {
            hasCommentHighlight = false;
            sectionNode.appendChild(commentSpanNode);
          }
          
        } else { // Else, just add it to the section node
          sectionNode.appendChild(wordNode);
          const spaceNode = document.createTextNode(" ");
          sectionNode.appendChild(spaceNode);
          
        }
      } 
      
      resultsContainer.append(sectionNode);
    }
    
    /* Add the results container at the end! */
    // parent.appendChild(leftColumnNode);
    parent.appendChild(resultsContainer);
    parent.appendChild(rightColumnNode);
  }
  
  function checkApaHandler(e) {
    e.preventDefault();
  }
  
  return (
    <div id="parent" className="App">
      <div id="header" className="header"></div>
      <div className="container">
        <h1>Essay Format Checker</h1>
        <form className="inputForm" autoComplete="off">
          <div className="input-field">
            <textarea onChange={inputTextOnChange} onBlur={inputTextChangeOnBlur} onFocus={inputTextChangeOnFocus} id="inputText" type="text" required/>
            <label id="responseImportant">Copy and paste your text here</label>
            <span></span>
          </div>
          <div className="bottom-row">
            <div className="importantButtons">
            { selectedFormat === "MLA" ?
              <button onClick={checkMlaHandler} type="submit" value="Check Paper" className="btn btn-check">Check for MLA format</button>
              :
              <button onClick={checkApaHandler} type="submit" value="Check Paper" className="btn btn-check">Check for APA format</button>
            }
              <select onChange={selectedFormatHandler} id="selectedFormat" name="inputFormat" className="btn btn-select">
                <option value="MLA">MLA</option>
                <option value="APA">APA</option>
              </select>
              <div className="checkbox-list">
                <div className="checkbox-item">
                  <input type="checkbox" id="includeCorrects" value="includeCorrects"/>
                  <label for="includeCorrects">Correct Formatting</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="includeSuggestions" value="includeSuggestions"/>
                  <label for="includeSuggestions">Suggestions</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="includeInvalids" value="includeInvalids"/>
                  <label for="includeInvalids">Invalid Formatting</label>
                </div>
              </div>
            </div>
            <button onClick={clearTextArea} type="submit" value="Clear" className="btn btn-clear">Clear Text</button>
          </div>
        </form>
      </div>
      
      <div id="bottom-parent" className="bottom-parent">
      </div>
      
    </div>
  );
}

export default App;
