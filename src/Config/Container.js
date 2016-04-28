'use strict';

const crate = require('crate-js'),
      ContainerBuilder = crate.ContainerBuilder,
      JsonLoader = crate.JsonLoader;

module.exports = (Bot) => {
    let builder = new ContainerBuilder(),
        loader = new JsonLoader();

    loader.addJson({ parameters: require('./parameters')(Bot) });
    loader.addJson({ services: require('./core') });

    builder.addLoader(loader);

    return {
        builder: builder, loader: loader
    };
}