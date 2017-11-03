;(function(ng) {
  "use strict";

  ng.module('alt.contador.exportacao-texto', [])
  .factory('AltContadorExportacaoTextoModel', [function() {
    var AltContadorExportacaoTextoModel = function(propriedades, propriedadesCentroDeCusto, info, arquivoContabil, separador) {
      this.separador = separador || ';';
      this.propriedades = propriedades || [];
      this.propriedadesCentroDeCusto = propriedadesCentroDeCusto || [];
      this.info = info || [];
      this.arquivoContabil = arquivoContabil || false;
    };

    return AltContadorExportacaoTextoModel;
  }])
  .factory('AltContadorExportacaoTextoParser', ['AltContadorExportacaoTextoModel', function(AltContadorExportacaoTextoModel) {
    var AltContadorExportacaoTextoParser = function(expModelo) {
      if (!(expModelo instanceof AltContadorExportacaoTextoModel)) {
        return this.expModelo = new AltContadorExportacaoTextoModel();
      }

      this.expModelo = expModelo;
    };

    AltContadorExportacaoTextoParser.prototype.parseArquivo = function() {
      var _matriz = [];
      var _propriedades = this.expModelo.propriedades;
      var _propriedadesCentroDeCusto = this.expModelo.propriedadesCentroDeCusto;
      var _listagem = this.expModelo.info;
      var _separador = this.expModelo.separador;
      var _arquivoContabil = !!this.expModelo.arquivoContabil;
      var _listagemFinal = [];
      var VALOR_MONETARIO_PATTERN = /\d+\.\d{1,2}/;
      var NUMERO_PATTERN = /\d/;
      var FIM_DE_LINHA_CODIFICADO = '%0A';
      var ESPACO_STRING_CODIFICADO = '%20';
      var NOME_PROPRIEDADE_CENTROS_DE_CUSTO = "centrosDeCusto";

      ng.forEach(_listagem, function(informacao) {
        var _valores = [];

        // Verifica se as propriedades de exportação do Centro de Custo estão informadas.
        // Serve para determinar se o Centro de Custo deve ser exportado ou não.
        var exportaCentroDeCusto = !!informacao[NOME_PROPRIEDADE_CENTROS_DE_CUSTO];

        ng.forEach(_propriedades, function(prop) {
          if (ng.isDefined(informacao[prop])) {
            var _valor = informacao[prop];

            if (_valor === "") {
              _valor = "\"\"";
            }
            else {
              if (_arquivoContabil) {
                _valor = "\"" + _valor + "\"";

                if (VALOR_MONETARIO_PATTERN.test(_valor) && /valor/.test(prop)) {
                  _valor = "\"" + VALOR_MONETARIO_PATTERN.exec(_valor).join().replace(".", ",") + "\"";
                }
              }
              else {
                  if (NUMERO_PATTERN.test(_valor)) {
                    _valor = "\"" + String(_valor).replace(".", ",") + "\"";
                  } else {
                    _valor = "\""+_valor+"\"";
                  }
              }
            }

            _valores.push(_valor);
          }
        });
        _matriz.push(_valores);

        // Caso a exportação de centro de custo seja necessária, realizar o parsing dos dados logo após os dados do seu lançamento respectivo
        if (exportaCentroDeCusto) {
          ng.forEach(informacao[NOME_PROPRIEDADE_CENTROS_DE_CUSTO], function(infoCentroDeCusto) {
            var _valoresCentroDeCusto = [];
            ng.forEach(_propriedadesCentroDeCusto, function(prop) {
              if (ng.isDefined(infoCentroDeCusto[prop])) {
                var _valorCentroDeCusto = infoCentroDeCusto[prop];

                if (_valorCentroDeCusto === "") {
                  _valorCentroDeCusto = "\"\"";
                }
                else {
                  if (_arquivoContabil) {
                    _valorCentroDeCusto = "\"" + _valorCentroDeCusto + "\"";

                    if (VALOR_MONETARIO_PATTERN.test(_valorCentroDeCusto) && /valor/.test(prop)) {
                      _valorCentroDeCusto = "\"" + VALOR_MONETARIO_PATTERN.exec(_valorCentroDeCusto).join().replace(".", ",") + "\"";
                    }
                  }
                  else {
                    if (NUMERO_PATTERN.test(_valorCentroDeCusto)) {
                      _valorCentroDeCusto = "\"" + String(_valorCentroDeCusto).replace(".", ",") + "\"";
                    } else {
                      _valorCentroDeCusto = "\""+_valorCentroDeCusto+"\"";
                    }
                  }
                }

                _valoresCentroDeCusto.push(_valorCentroDeCusto);
              }
            });
            
            _matriz.push(_valoresCentroDeCusto);
          });
        }
      });

      ng.forEach(_matriz, function(linha, indice) {
        _listagemFinal.push(linha.join(_separador));
      });

      return _listagemFinal.join(FIM_DE_LINHA_CODIFICADO).replace(/ /g, ESPACO_STRING_CODIFICADO);
    };

    return AltContadorExportacaoTextoParser;
  }])
  .factory('AltContadorExportacaoTextoExec', [function() {
    var AltContadorExportacaoTextoExec = function(doc) {
      this.document = doc;
    };

    AltContadorExportacaoTextoExec.prototype.exporta = function(info, nomeArquivo, tipoArquivo) {
      var _a = this.document.createElement('a');

      _a.href = 'data:attachment/' + tipoArquivo + ';charset=utf-8,%EF%BB%BF' + info;
      _a.target = '_blank';
      _a.download = nomeArquivo;

      this.document.body.appendChild(_a);
      _a.click();
      this.document.body.removeChild(_a);
    };

    return AltContadorExportacaoTextoExec;
  }])
  .directive('altContadorExportacaoTexto', [
    'AltContadorExportacaoTextoModel',
    'AltContadorExportacaoTextoParser',
    'AltContadorExportacaoTextoExec',
    function(AltContadorExportacaoTextoModel, AltContadorExportacaoTextoParser, AltContadorExportacaoTextoExec) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var _parser = null;
          var _modelo = null;
          var _exec = new AltContadorExportacaoTextoExec(document);

          element.on('click', function() {
            var _tipoArquivo = scope.tipoArquivo || 'csv';
            var _nomeArquivo = scope.nomeArquivo || 'Exportação';
            var _info = scope.preparaInfo();

            _modelo = new AltContadorExportacaoTextoModel(_info.propriedades, _info.info, scope.arquivoContabil, scope.separador);
            _parser = new AltContadorExportacaoTextoParser(_modelo);

            _exec.exporta(_parser.parseArquivo(), _nomeArquivo, _tipoArquivo);
          });
        },
        scope: {
          nomeArquivo: '@',
          tipoArquivo: '@',
          arquivoContabil: '@',
          separador: '@',
          preparaInfo: '&'
        }
      };
  }]);
}(window.angular))
