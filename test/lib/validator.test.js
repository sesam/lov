'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );

const validate = require( '../../lib/validator' );

describe( 'lib/validate', function() {

    describe( 'validate', function() {

        it( 'normal operation', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2,
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let result = validate( data, schema );

            expect( data ).to.eql( { name: 'fred', special: 28 } );
            expect( result.error ).to.equal( null );
            expect( result.value ).to.eql( { name: 'fred', special: 42 } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'normal operation, allowAdditional = true', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2,
            };

            let data = {

                name: 'fred',

                special: 28,

                other: '43'
            };

            let result = validate( data, schema, { allowAdditional: true } );

            expect( data ).to.eql( { name: 'fred', special: 28 , other: '43' } );
            expect( result.error ).to.equal( null );
            expect( result.value ).to.eql( { name: 'fred', special: 42, other: '43' } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'normal operation, callback', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2,
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let callback = sinon.stub();

            validate( data, schema, callback );

            expect( data ).to.eql( { name: 'fred', special: 28 } );

            expect( callback.calledOnce ).to.be.true;
            expect( callback.withArgs( null,  { name: 'fred', special: 42 } ).calledOnce ).to.be.true;

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'normal operation with options.updateValues = true', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2,
            };

            let data = {

                name: 'fred',

                special: 28
            };


            let results = validate( data, schema, { updateValues: true } );

            expect( data ).to.eql( { name: 'fred', special: 42 } );
            expect( results.value ).to.eql( { name: 'fred', special: 42 } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'normal operation, options and callback', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2,
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let callback = sinon.stub();

            validate( data, schema, {}, callback );

            expect( data ).to.eql( { name: 'fred', special: 28 } );

            expect( callback.calledOnce ).to.be.true;
            expect( callback.withArgs( null,  { name: 'fred', special: 42 } ).calledOnce ).to.be.true;

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });


        it( 'empty values with validator returning value', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returns( 42 ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data;

            let result = validate( data, schema );

            expect( result.error ).to.be.null;
            expect( result.value ).to.eql( { special: 42 } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs().calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs().calledOnce ).to.be.true;
        });

        it( 'empty values', function() {

            let v1 = { validate: sinon.stub() };

            let v2 = { validate: sinon.stub() };

            let schema = {

                name: v1,

                special: v2
            };

            let data;

            let result = validate( data, schema );

            expect( result.error ).to.be.null;
            expect( result.value ).to.eql( { } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs().calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs().calledOnce ).to.be.true;
        });

        it( 'empty values with undefined values', function() {

            let v1 = { validate: sinon.stub() };

            let v2 = { validate: sinon.stub() };

            let schema = {

                name: v1,

                special: v2
            };

            let data = { name: undefined };

            let result = validate( data, schema );

            expect( result.error ).to.be.null;
            expect( result.value ).to.eql( { name: undefined } );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs().calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs().calledOnce ).to.be.true;
        });

        it( 'schema validator', function() {

            let v = { validate: sinon.stub().returns( 'A' ) };

            let result = validate( 'a', v );

            expect( result.error ).to.be.null;
            expect( result.value ).to.equal( 'A' );

            expect( v.validate.calledOnce ).to.be.true;
            expect( v.validate.withArgs( 'a' ).calledOnce ).to.be.true;
        });

        it( 'schema validator with alternatives using short form brackets', function() {

            let v1 = { validate: sinon.stub().throws( new Error( '!!!' ) ) };
            let v2 = { validate: sinon.stub().returns( 'A' ) };

            let result = validate( 'a', [ v1, v2 ] );

            expect( result.error ).to.be.null;
            expect( result.value ).to.equal( 'A' );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'a' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 'a' ).calledOnce ).to.be.true;

        });

        it( 'fail: when error detected during validation', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().throws( new Error( 'bad value') ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let result = validate( data, schema );

            expect( result.error.message ).to.contain( 'special: bad value' );
            expect( result.value ).to.eql( data );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'fail: when error detected during validation, callback', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().throws( new Error( 'bad value') ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let callback = sinon.stub();

            validate( data, schema, callback );

            expect( callback.calledOnce ).to.be.true;
            expect( callback.firstCall.args[0].message ).to.equal( 'special: bad value' );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'fail: when error detected during validation, options.wantResults = true', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().throws( new Error( 'bad value') ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28
            };

            let results = validate( data, schema, { wantResults: true } );

            expect( results.error ).to.exist;
            expect( results.error.message ).to.equal( 'special: bad value' );

            expect( v1.validate.calledOnce ).to.be.true;
            expect( v1.validate.withArgs( 'fred' ).calledOnce ).to.be.true;

            expect( v2.validate.calledOnce ).to.be.true;
            expect( v2.validate.withArgs( 28 ).calledOnce ).to.be.true;
        });

        it( 'fail: when additional values are present, single item', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returnsArg( 0 ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28,

                extra: 42
            };

            let result = validate( data, schema );

            expect( result.error.message ).to.contain( '"extra" is not allowed' );
            expect( result.value ).to.eql( data );

            expect( v1.validate.called ).to.be.false;
            expect( v2.validate.called ).to.be.false;
        });

        it( 'fail: when additional values are present, two items', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returnsArg( 0 ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28,

                extra: 42,

                extra2: 43
            };

            let result = validate( data, schema );

            expect( result.error.message ).to.contain( '"extra" and "extra2" are not allowed' );
            expect( result.value ).to.eql( data );

            expect( v1.validate.called ).to.be.false;

            expect( v2.validate.called ).to.be.false;
        });

        it( 'fail: when additional values are present, more than 2 items', function() {

            let v1 = { validate: sinon.stub().returnsArg( 0 ) };

            let v2 = { validate: sinon.stub().returnsArg( 0 ) };

            let schema = {

                name: v1,

                special: v2
            };

            let data = {

                name: 'fred',

                special: 28,

                extra: 42,

                extra2: 43,

                extra3: 44
            };

            let result = validate( data, schema );

            expect( result.error.message ).to.contain( '"extra", "extra2", and "extra3" are not allowed' );
            expect( result.value ).to.eql( data );

            expect( v1.validate.called ).to.be.false;

            expect( v2.validate.called ).to.be.false;
        });
    });
});
