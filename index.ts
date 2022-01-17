#! /usr/bin/env node

const SUCCESSFUL = 0;
const NOT_SUCCESSFUL = 1;
const APP = 'sleepx';

// console.time( APP );

if ( process.argv.length <= 2 ) {
    process.stderr.write( "Missing argument. See 'sleepx --help' for more information." );
    process.exit( NOT_SUCCESSFUL );
}

const input: string = process.argv[ 2 ].trim();

if ( input === '--help' ) {
    process.stdout.write( 'Usage:\n' );
    process.stdout.write( `  ${APP} <number>    Pause for <number> seconds.\n` );
    process.stdout.write( `  ${APP} <number>s   Pause for <number> seconds.\n` );
    process.stdout.write( `  ${APP} <number>m   Pause for <number> minutes.\n` );
    process.stdout.write( `  ${APP} <number>h   Pause for <number> hours.\n` );
    process.stdout.write( `  ${APP} <number>d   Pause for <number> days.\n` );
    process.stdout.write( `  ${APP} --help      Display this help and exit.\n` );
    process.stdout.write( `  ${APP} --version   Output version information and exit.\n` );
    process.stdout.write( '\nExample:\n' );
    process.stdout.write( `  ${APP} 1\n` );
    process.exit( SUCCESSFUL );

} else if ( input === '--version' ) {

    const readFile = require( 'fs' ).readFile;
    const promisify = require( 'util' ).promisify;
    const fread = promisify( readFile );
    fread( 'package.json' )
        .then( function ( value: any ) {
            const obj = JSON.parse( value )
            process.stdout.write( obj.version || '1.0.0' );
            process.exit( SUCCESSFUL );
        } )
        .catch( function ( err: any ) {
            process.stderr.write( 'Could not retrieve the version.' );
            process.exit( NOT_SUCCESSFUL );
        } );

} else {

    process.on( 'uncaughtException', console.error );

    process.on( 'SIGINT', () => { // e.g., Ctrl + C
        process.stdout.write( `${APP} aborted. Bye!` );
        process.exit( NOT_SUCCESSFUL );
    } );

    const sleep = async ( ms: number ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );

    let time = Number( input );
    if ( /^[0-9]{1,9}s?$/.test( input ) ) { // Seconds
        time *= 1000;
    } else if ( /^[0-9]{1,9}m$/.test( input ) ) { // Minutes
        time *= 60 * 1000;
    } else if ( /^[0-9]{1,9}h$/.test( input ) ) { // Hours
        time *= 60 * 60 * 1000;
    } else if ( /^[0-9]{1,9}d$/.test( input ) ) { // Days
        time *= 24 * 60 * 60 * 1000;
    } else {
        process.stderr.write( `Invalid time interval: "${input}"` );
        process.exit( NOT_SUCCESSFUL );
    }

    sleep( time )
        .catch( function ( err ) {
            process.stderr.write( 'Error while sleeping.' );
            process.exit( NOT_SUCCESSFUL );
        } )
        // .then( function () {
        //     console.timeEnd( APP );
        // } )
        ;

}