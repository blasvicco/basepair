module.exports = (name) => {
  const start = new Date();
  return {
    stop: function() {
      const end  = new Date();
      const time = end.getTime() - start.getTime();
      return `Timer: ${name} finished in ${time} ms.`;
    }
  };
};
