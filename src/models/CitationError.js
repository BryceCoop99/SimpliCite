export class CitationError {
  
  constructor(citation) {
    this.citation = citation;
    // this.errors = undefined;
    // this.citationSection = undefined;
    // this.citationIndex = undefined;
  }
  
  getCitation() {
    return this.citation;
  }
  
  setCitation(citation) {
    this.citation = citation;
  }
  
  getCitationErrors() {
    return this.errors;
  }
  
  setCitationErrors(errors) {
    this.errors = errors;
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