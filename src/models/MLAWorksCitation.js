export class MLAWorksCitation {
  /** 
  * Author, Title of source, Title of container, Other contributors
  * Version, Number, Publisher, Publication date, Location.
  * 
  * REMEMBER that in this class specifically,
  * the indexes for everything other than the works cited section index
  * is the index of the sentence! NOT the index of the character as in other
  * classes.
  */
  constructor(worksCitation, secIndex) {
    this.worksCitation = worksCitation;
    this.secIndex = secIndex;
  }
  
  getSectionIndex() {
    return this.secIndex;
  }
  
  setSectionIndex(secIndex) {
    this.secIndex = secIndex;
  }
  
  getWorksCitation() {
    return this.worksCitation;
  }
  
  setWorksCitation(worksCitation) {
    this.worksCitation = worksCitation;
  }
  
  getWorksCitationErrors() {
    return this.worksCitationErrors;
  }
  
  setWorksCitationErrors(worksCitationErrors) {
    this.worksCitationErrors = worksCitationErrors;
  }
  
  getAuthor() {
    return this.author;
  }
  
  setAuthor(author) {
    this.author = author;
  }
  
  getAuthorErrors() {
    return this.authorErrors;
  }
  
  setAuthorErrors(authorErrors) {
    this.authorErrors = authorErrors;
  }
  
  getAuthorIndex() {
    return this.authorIndex;
  }
  
  setAuthorIndex(authorIndex) {
    this.authorIndex = authorIndex;
  }
  
  getAuthorAcronym() {
    return this.authorAcronym;
  }
  
  setAuthorAcronym(authorAcronym) {
    this.authorAcronym = authorAcronym;
  }
  
  getTitleSource() {
    return this.titleSource;
  }
  
  setTitleSource(titleSource) {
    this.titleSource = titleSource;
  }
  
  getTitleSourceErrors() {
    return this.titleSourceErrors;
  }
  
  setTitleSourceErrors(titleSourceErrors) {
    this.titleSourceErrors = titleSourceErrors;
  }
  
  getTitleSourceIndex() {
    return this.titleSourceIndex;
  }
  
  setTitleSourceIndex(titleSourceIndex) {
    this.titleSourceIndex = titleSourceIndex;
  }
  
  getTitleContainer() {
    return this.titleContainer;
  }
  
  setTitleContainer(titleContainer) {
    this.titleContainer = titleContainer;
  }
  
  getTitleContainerErrors() {
    return this.titleContainerErrors;
  }
  
  setTitleContainerErrors(titleContainerErrors) {
    this.titleContainerErrors = titleContainerErrors;
  }
  
  getTitleContainerIndex() {
    return this.titleContainerIndex;
  }
  
  setTitleContainerIndex(titleContainerIndex) {
    this.titleContainerIndex = titleContainerIndex;
  }
  
  getContributors() {
    return this.contributors;
  }
  
  setContributors(contributors) {
    this.contributors = contributors;
  }
  
  getContributorsErrors() {
    return this.contributorsErrors;
  }
  
  setContributorsErrors(contributorsErrors) {
    this.contributorsErrors = contributorsErrors;
  }
  
  getContributorsIndex() {
    return this.contributorsIndex;
  }
  
  setContributorsIndex(contributorsIndex) {
    this.contributorsIndex = contributorsIndex;
  }
  
  getVersion() {
    return this.version;
  }
  
  setVersion(version) {
    this.version = version;
  }
  
  getVersionErrors() {
    return this.versionErrors;
  }
  
  setVersionErrors(versionErrors) {
    this.versionErrors = versionErrors;
  }
  
  getVersionIndex() {
    return this.versionIndex;
  }
  
  setVersionIndex(versionIndex) {
    this.versionIndex = versionIndex;
  }
  
  getPublisher() {
    return this.publisher;
  }
  
  setPublisher(publisher) {
    this.publisher = publisher;
  }
  
  getPublisherErrors() {
    return this.publisherErrors;
  }
  
  setPublisherErrors(publisherErrors) {
    this.publisherErrors = publisherErrors;
  }
  
  getPublisherIndex() {
    return this.publisherIndex;
  }
  
  setPublisherIndex(publisherIndex) {
    this.publisherIndex = publisherIndex;
  }
  
  getPublicationDate() {
    return this.publicationDate;
  }
  
  setPublicationDate(publicationDate) {
    this.publicationDate = publicationDate;
  }
  
  getPublicationDateErrors() {
    return this.publicationDateErrors;
  }
  
  setPublicationDateErrors(publicationDateErrors) {
    this.publicationDateErrors = publicationDateErrors;
  }
  
  getPublicationDateIndex() {
    return this.publicationDateIndex;
  }
  
  setPublicationDateIndex(publicationDateIndex) {
    this.publicationDateIndex = publicationDateIndex;
  }
  
  getLocation() {
    return this.aLocation;
  }
  
  setLocation(aLocation) {
    this.aLocation = aLocation;
  }
  
  getLocationErrors() {
    return this.locationErrors;
  }
  
  setLocationErrors(locationErrors) {
    this.locationErrors = locationErrors;
  }
  
  getLocationIndex() {
    return this.locationIndex;
  }
  
  setLocationIndex(locationIndex) {
    this.locationIndex = locationIndex;
  }
  
}