"use strict";

describe('alt.contador.exportacao-texto', function() {
  var _scope, _element, _compile, _AltContadorExportacaoTextoParser, _AltContadorExportacaoTextoExec, _AltContadorExportacaoTextoModel;

  beforeEach(module('alt.contador.exportacao-texto'));

  beforeEach(inject(function($injector) {
    _scope = $injector.get('$rootScope').$new();
    _compile = $injector.get('$compile');

    _AltContadorExportacaoTextoParser = $injector.get('AltContadorExportacaoTextoParser');
    _AltContadorExportacaoTextoExec = $injector.get('AltContadorExportacaoTextoExec');
    _AltContadorExportacaoTextoModel = $injector.get('AltContadorExportacaoTextoModel');
  }));

  describe('directive', function() {
    describe('criação', function() {
      beforeEach(function() {
        _scope.cb = function() {};
        _scope.n = 'nome.123.csv';
        _scope.t = 'txt';
        _scope.s = '|';

        var _html = '<div alt-contador-exportacao-texto prepara-info="cb()" nome-arquivo="{{n}}" tipo-arquivo="{{t}}" separador="{{s}}"></div>';

        _element = angular.element(_html);
        _compile(_element)(_scope);

        _scope.$digest();
      })

      it('deve inicializar corretamente', function() {
        expect(_element).toBeDefined();
      });

      it('deve ter nome e preparaInfo definidos', function() {
        expect(typeof _element.isolateScope().preparaInfo).toEqual("function");
        expect(_element.isolateScope().nomeArquivo).toEqual(_scope.n);
        expect(_element.isolateScope().tipoArquivo).toEqual(_scope.t);
        expect(_element.isolateScope().separador).toEqual(_scope.s);
      });
    });

    describe('onClick', function() {
      it('deve funcionar corretamente ao ser clicada', function() {
        _scope.cb = function() {
          return {
            info: [{x: 1, y: 2, z: 3}],
            propriedades: ['x', 'y', 'z']
          };
        };

        _scope.nome = 'meu_arquivo.csv';

        var _html = '<div alt-contador-exportacao-texto prepara-info="cb()" nome="nome"></div>';

        _element = angular.element(_html);
        _compile(_element)(_scope);

        _scope.$digest();

        _element.click();
      });
    });
  });

  describe('services', function() {
    describe('AltContadorExportacaoTextoModel', function() {
      describe('criação', function() {
        it('deve ser uma function', function() {
          expect(typeof _AltContadorExportacaoTextoModel).toBe('function');
        });

        it('deve ter os valores corretos para a instância - valores default', function() {
          var _m = new _AltContadorExportacaoTextoModel();

          expect(_m.infoNaoTabelada).toEqual(undefined);
          expect(_m.propriedades).toEqual([]);
          expect(_m.propriedadesCentroDeCusto).toEqual([]);
          expect(_m.info).toEqual([]);
          expect(_m.arquivoContabil).toEqual(false);
        });

        it('deve ter os valores corretos para a instância - tudo preenchido', function() {
          var _propriedades = ['a', 'b'];
          var _propriedadesCentroDeCusto = ['c', 'd'];
          var _info = 'abc';
          var _arquivoContabil = true;
          var _separador = '|';

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil, _separador);

          expect(_m.propriedades).toEqual(_propriedades);
          expect(_m.propriedadesCentroDeCusto).toEqual(_propriedadesCentroDeCusto);
          expect(_m.separador).toEqual(_separador);
          expect(_m.info).toEqual(_info);
          expect(_m.arquivoContabil).toEqual(_arquivoContabil);
        });
      });
    });

    describe('AltContadorExportacaoTextoParser', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltContadorExportacaoTextoParser).toBe('function');
        });
      });

      describe('parseArquivo', function() {
        it('deve fazer o parse corretamente - não é arquivo contábil, com valores vazios - todos devem ter aspas', function() {
          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, d: ""},
            {a: 4, b: 5, c: 6, d: ""},
            {a: 7, b: 8, c: 9, d: 'abc123'},
          ];

          var _resposta = '"1";"2";"3";""%0A"4";"5";"6";""%0A"7";"8";"9";"abc123"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil', function() {
          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: 6},
            {a: 7, b: 8, c: 9},
          ];

          var _resposta = '"1";"2";"3"%0A"4";"5";"6"%0A"7";"8";"9"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil - possui caracter de quebra de linha', function() {
          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: '6↵'},
            {a: 7, b: 8, c: 9},
          ];

          var _resposta = '"1";"2";"3"%0A"4";"5";"6"%0A"7";"8";"9"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil e tem separador diferente de ;', function() {
          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: 6},
            {a: 7, b: 8, c: 9},
          ];

          var _separador = '|';

          var _resposta = '"1"|"2"|"3"%0A"4"|"5"|"6"%0A"7"|"8"|"9"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil, _separador);
          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil, tem separador diferente de ; e tem valores com vírgula', function() {
          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d'},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h'},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l'},
          ];

          var _separador = '|';

          var _resposta = '"1"|"2"|"3"|"a,b,c,d"%0A"4"|"5"|"6"|"e,f,g,h"%0A"7"|"8"|"9"|"i,j,k,l"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil, _separador);
          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil, tem informações o seperador default (;) e tem valores com vírgula e valores monetários', function() {
          var _propriedades = [
            'a', 'b', 'c', 'd', 'e'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d', e: 1.11},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h', e: 2.22},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l', e: 3.33},
          ];

          var _resposta = '"1";"2";"3";"a,b,c,d";"1,11"%0A"4";"5";"6";"e,f,g,h";"2,22"%0A"7";"8";"9";"i,j,k,l";"3,33"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);
          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - não é arquivo contábil, tem separador por vírgula e tem valores com vírgula nas informacoesNaoTabeladas e nos valores tambem', function() {
          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d'},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h'},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l'},
          ];

          var _separador = ',';

          var _resposta = '"1","2","3","a,b,c,d"%0A"4","5","6","e,f,g,h"%0A"7","8","9","i,j,k,l"';

          var _arquivoContabil = false;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil, _separador);
          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - é arquivo contábil', function() {
          var _propriedades = [
            'a', 'b', 'c', 'valor'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99'},
            {a: 4, b: 5, c: 6, valor: '1.9'},
            {a: 7, b: 8, c: 9, valor: '0.99'},
            {a: 10, b: 11, c: 12, valor: '1000.99'},
          ];

          var _resposta = '"1";"2";"3";"1,99"%0A"4";"5";"6";"1,9"%0A"7";"8";"9";"0,99"%0A"10";"11";"12";"1000,99"';

          var _arquivoContabil = true;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - é arquivo contábil e tem separador diferente', function() {
          var _separador = '|'

          var _propriedades = [
            'a', 'b', 'c', 'valor'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99'},
            {a: 4, b: 5, c: 6, valor: '1.9'},
            {a: 7, b: 8, c: 9, valor: '0.99'},
            {a: 10, b: 11, c: 12, valor: '1000.99'},
          ];

          var _resposta = '"1"|"2"|"3"|"1,99"%0A"4"|"5"|"6"|"1,9"%0A"7"|"8"|"9"|"0,99"%0A"10"|"11"|"12"|"1000,99"';

          var _arquivoContabil = true;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil, _separador);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - é arquivo contábil - existem outros valores parecidos com monetarios, mas não deve sofrer mudança', function() {
          var _propriedades = [
            'a', 'b', 'c', 'valor', 'outraInfo'
          ];

          var _propriedadesCentroDeCusto = [];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99', outraInfo: '1.88'},
            {a: 4, b: 5, c: 6, valor: '1.9', outraInfo: '777'},
            {a: 7, b: 8, c: 9, valor: '0.99', outraInfo: '5.77'},
            {a: 10, b: 11, c: 12, valor: '1000.99', outraInfo: 'itaú 1.1'}
          ];

          var _resposta = '"1";"2";"3";"1,99";"1.88"%0A"4";"5";"6";"1,9";"777"%0A"7";"8";"9";"0,99";"5.77"%0A"10";"11";"12";"1000,99";"itaú%201.1"';

          var _arquivoContabil = true;

          var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

          var _parser = new _AltContadorExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        describe('centroDeCusto', function() {
          it('deve fazer o parse corretamente - contém 1 lançamento com centro de custo (débito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', idContabilCentroDeCusto: '2562', centrosDeCusto: [{
                b: 2,
                idContabilCentroDeCusto: '2562',
                valor: '1.99',
                operacaoDebitoCredito: 'D'}
              ]}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,99";"D"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });

          it('deve fazer o parse corretamente - contém 1 lançamento com centro de custo (crédito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', idContabilCentroDeCusto: '2562', centrosDeCusto: [{
                b: 2,
                idContabilCentroDeCusto: '2562',
                valor: '1.99',
                operacaoDebitoCredito: 'C'}
              ]}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,99";"C"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });

          it('deve fazer o parse corretamente - contém 2 lançamentos, apenas 1 com centro de custo (crédito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2562',
                  valor: '1.99',
                  operacaoDebitoCredito: 'C'
                }
              ]},
              {a: 1, b: 2, valor: '1.55', outraInfo: '1.78'}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,99";"C"%0A"1";"2";"1,55";"1.78"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });

          it('deve fazer o parse corretamente - contém 2 lançamentos com centro de custo (crédito e débito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2562',
                  valor: '1.99',
                  operacaoDebitoCredito: 'C'
                }
              ]},
              {a: 1, b: 2, valor: '1.55', outraInfo: '1.78', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2563',
                  valor: '1.55',
                  operacaoDebitoCredito: 'D'
                }
              ]}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,99";"C"%0A"1";"2";"1,55";"1.78"%0A"2";"2563";"1,55";"D"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });

          it('deve fazer o parse corretamente - contém 2 lançamentos c/ centros de custo (débito/crédito e crédito/débito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2562',
                  valor: '1.09',
                  operacaoDebitoCredito: 'D'
                },
                {
                  b: 2,
                  idContabilCentroDeCusto: '2563',
                  valor: '0.90',
                  operacaoDebitoCredito: 'C'
                }
              ]},
              {a: 1, b: 2, valor: '1.55', outraInfo: '1.78', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2563',
                  valor: '1.55',
                  operacaoDebitoCredito: 'C'
                },
                {
                  b: 2,
                  idContabilCentroDeCusto: '2562',
                  valor: '1.55',
                  operacaoDebitoCredito: 'D'
                }
              ]}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,09";"D"%0A"2";"2563";"0,90";"C"%0A"1";"2";"1,55";"1.78"%0A"2";"2563";"1,55";"C"%0A"2";"2562";"1,55";"D"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });

          it('deve fazer o parse corretamente - contém 2 lançamentos c/ centros de custo (débito/crédito e débito)', function() {
            var _propriedades = [
              'a', 'b', 'valor', 'outraInfo'
            ];

            var _propriedadesCentroDeCusto = [
              'b', 'idContabilCentroDeCusto', 'valor', 'operacaoDebitoCredito'
            ];

            var _info = [
              {a: 1, b: 2, valor: '1.99', outraInfo: '1.88', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2562',
                  valor: '1.09',
                  operacaoDebitoCredito: 'D'
                },
                {
                  b: 2,
                  idContabilCentroDeCusto: '2563',
                  valor: '0.90',
                  operacaoDebitoCredito: 'C'
                }
              ]},
              {a: 1, b: 2, valor: '1.55', outraInfo: '1.78', centrosDeCusto: [
                {
                  b: 2,
                  idContabilCentroDeCusto: '2563',
                  valor: '1.55',
                  operacaoDebitoCredito: 'D'
                }
              ]}
            ];

            var _resposta = '"1";"2";"1,99";"1.88"%0A"2";"2562";"1,09";"D"%0A"2";"2563";"0,90";"C"%0A"1";"2";"1,55";"1.78"%0A"2";"2563";"1,55";"D"';

            var _arquivoContabil = true;

            var _m = new _AltContadorExportacaoTextoModel(_propriedades, _propriedadesCentroDeCusto, _info, _arquivoContabil);

            var _parser = new _AltContadorExportacaoTextoParser(_m);
            var _resultadoParsed = _parser.parseArquivo();

            expect(_resultadoParsed).toEqual(_resposta);
          });
        });
      });
    });

    describe('AltContadorExportacaoTextoExec', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltContadorExportacaoTextoExec).toBe('function');
        });

        it('deve ter document com o que é passado por parâmetro', function() {
          var _doc = {a: 1};

          var _exec = new _AltContadorExportacaoTextoExec(_doc);

          expect(_exec.document).toEqual(_doc);
        });
      });

      describe('exporta', function() {
        it('deve adicionar os valores corretos ao elemento a', function() {
          var _a = {
              click: angular.noop
          };

          var _fakeDocument = {
            body: {
              removeChild: angular.noop,
              appendChild: angular.noop
            },
            createElement: function() {
              return _a;
            }
          };

          var _info = '{"a": 1}';
          var _nomeArquivo = 'nome.123';
          var _tipoArquivo = 'txt';

          spyOn(_fakeDocument, 'createElement').and.callThrough();
          spyOn(_fakeDocument.body, 'appendChild').and.callThrough();
          spyOn(_fakeDocument.body, 'removeChild').and.callThrough();
          spyOn(_a, 'click').and.callThrough();

          var _exec = new _AltContadorExportacaoTextoExec(_fakeDocument);

          _exec.exporta(_info, _nomeArquivo, _tipoArquivo);

          expect(_a.href).toBe('data:attachment/' + _tipoArquivo + ';charset=utf-8,%EF%BB%BF' + _info)
          expect(_a.target).toBe('_blank');
          expect(_a.download).toBe(_nomeArquivo);

          expect(_fakeDocument.createElement).toHaveBeenCalledWith('a');
          expect(_fakeDocument.body.appendChild).toHaveBeenCalledWith(_a);
          expect(_a.click).toHaveBeenCalled();
          expect(_fakeDocument.body.removeChild).toHaveBeenCalledWith(_a);
        });
      });
    });
  });
});
