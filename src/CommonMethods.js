export default{
  sortByNextExecution(a,b){
    return new Date(a.nextRun) - new Date(b.nextRun);
  },
  uniqueValues(value,index,self){
    return self.indexOf(value) === index;
  },
  async copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
    }catch(err){
      alert(err);
    }
  }
}
