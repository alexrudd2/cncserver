/**
 * @file CNCServer ReSTful API endpoint module for pen state management.
 */
const handlers = {};

module.exports = (cncserver) => {
  handlers['/v2/tools'] = function toolsGet(req) {
    if (req.route.method === 'get') { // Get list of tools
      return {
        code: 200,
        body: {
          tools: Object.keys(cncserver.settings.botConf.get('tools')),
          toolData: cncserver.settings.botConf.get('tools'),
        },
      };
    }

    // Error to client for unsupported request types.
    return false;
  };

  // Standard toolchanges.
  // TODO: Prevent manual swap "wait" toolchanges on this endpoint?
  handlers['/v2/tools/:tool'] = function toolsMain(req, res) {
    const toolName = req.params.tool;
    // TODO: Support other tool methods... (needs API design!)
    if (req.route.method === 'put') { // Set Tool
      if (cncserver.settings.botConf.get(`tools:${toolName}`)) {
        cncserver.control.setTool(toolName, null, () => {
          res.status(200).send(JSON.stringify({
            status: `Tool changed to ${toolName}`,
          }));

          if (cncserver.settings.gConf.get('debug')) {
            console.log('>RESP', req.route.path, 200, `Tool:${toolName}`);
          }
        }, req.body.waitForCompletion);
        return true; // Tell endpoint wrapper we'll handle the response
      }

      return [404, `Tool: "${toolName}" not found`];
    }

    // Error to client for unsupported request types.
    return false;
  };

  // "wait" manual swap toolchanges with index
  handlers['/v2/tools/:tool/:index'] = function toolsMain(req, res) {
    const toolName = req.params.tool;
    const toolIndex = req.params.index;

    if (req.route.method === 'put') { // Set Tool
      if (cncserver.settings.botConf.get(`tools:${toolName}`)) {
        cncserver.control.setTool(toolName, toolIndex, () => {
          cncserver.pen.forceState({ tool: toolName });
          res.status(200).send(JSON.stringify({
            status: `Tool changed to ${toolName}, for index ${toolIndex}`,
          }));

          if (cncserver.settings.gConf.get('debug')) {
            console.log('>RESP', req.route.path, 200, `Tool:${toolName}, Index:${toolIndex}`);
          }
        }, req.body.waitForCompletion);
        return true; // Tell endpoint wrapper we'll handle the response
      }

      return [404, `Tool: "${toolName}" not found`];
    }

    // Error to client for unsupported request types.
    return false;
  };

  return handlers;
};
