export class Quote {
  
  constructor(quote) {
    this.quote = quote;
    // this.quoteErrors = undefined;
    // this.citation = undefined;
    // this.citationErrors = undefined;
    // this.quoteSection = undefined;
    // this.quoteIndex = undefined;
    // this.citationSection = undefined;
    // this.citationIndex = undefined;
  }
  
  getQuote() {
    return this.quote;
  }
  
  setQuote(newQuote) {
    this.quote = newQuote;
  }
  
  getQuoteErrors() {
    return this.quoteErrors;
  }
  
  setQuoteErrors(errors) {
    this.quoteErrors = errors;
  }
  
  getCitation() {
    return this.citation;
  }
  
  setCitation(newCitation) {
    this.citation = newCitation;
  }
  
  getCitationErrors() {
    return this.citationErrors;
  }
  
  setCitationErrors(errors) {
    this.citationErrors = errors;
  }
  
  // Possibly?
  getQuoteSection() {
    return this.quoteSection;
  }
  
  setQuoteSection(newQuoteSection) {
    this.quoteSection = newQuoteSection;
  }
  
  getQuoteIndex() {
    return this.quoteIndex;
  }
  
  setQuoteIndex(newQuoteIndex) {
    this.quoteIndex = newQuoteIndex;
  }
  
  getCitationSection() {
    return this.citationSection;
  }
  
  setCitationSection(newCitationSection) {
    this.citationSection = newCitationSection;
  }
  
  getCitationIndex() {
    return this.citationIndex;
  }
  
  setCitationIndex(newCitationIndex) {
    this.citationIndex = newCitationIndex;
  }
  
}