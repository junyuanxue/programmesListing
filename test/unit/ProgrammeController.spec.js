describe('ProgrammeController', function () {
  beforeEach(module('programmeListings'));

  var ctrl, ProgrammeService, ProgrammeFactory, httpBackend;

  beforeEach(inject(function ($controller, _ProgrammeService_, _ProgrammeFactory_, $httpBackend) {
    ctrl = $controller('ProgrammeController');
    ProgrammeService = _ProgrammeService_;
    ProgrammeFactory = _ProgrammeFactory_;
    httpBackend = $httpBackend;
  }));

  describe('controller set up', function () {
    it('has a list of alphabet', function () {
      var letters = [
        'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', '0-9'
      ]
      expect(ctrl.letters).toEqual(letters);
    });

    it('has an empty list of programmes', function () {
      expect(ctrl.programmes).toEqual([]);
    });

    it('has no pages', function () {
      expect(ctrl.pages).toEqual([]);
    });
  });

  describe('getProgrammes', function () {
    beforeEach(function () {
      var data = {
        numOfPages: 2,
        programmes: [
          { title: 'Abadas', image: 'https://abadas.jpg/' },
          { title: 'ABBA', image: 'https://abba.jpg/' }
        ]
      };

      httpBackend.expectGET('/api/programmes/a?page=1').respond(data);
      ctrl.getProgrammes('a');
      httpBackend.flush();
    });

    it('instructs service to make an API call', function () {
      spyOn(ProgrammeService, 'getProgrammes').and.callThrough();
      ctrl.getProgrammes('a');

      expect(ProgrammeService.getProgrammes).toHaveBeenCalledWith('a', 1);
    });

    it('updates the programmes', function () {
      var programme1 = new ProgrammeFactory('Abadas', 'https://abadas.jpg/');
      var programme2 = new ProgrammeFactory('ABBA', 'https://abba.jpg/');

      expect(ctrl.programmes).toEqual([programme1, programme2]);
    });

    it('updates the pages', function () {
      expect(ctrl.pages).toEqual([1, 2]);
    });

    it('updates the current letter', function () {
      expect(ctrl.currentLetter).toEqual('a');
    });
  });

  describe('loadPage', function () {
    beforeEach(function () {
      var data = {
        numOfPages: 4,
        programmes: [
          { title: 'BBC Proms', image: 'https://proms.jpg/' }
        ]
      };

      httpBackend.expectGET('/api/programmes/b?page=2').respond(data);
      ctrl.currentLetter = 'b';
      ctrl.loadPage(2);
      httpBackend.flush();
    });

    it('instructs the service to make a new API call', function () {
      spyOn(ProgrammeService, 'getProgrammes').and.callThrough();
      ctrl.loadPage(2);

      expect(ProgrammeService.getProgrammes).toHaveBeenCalledWith('b', 2);
    });

    it('updates the programmes', function () {
      var programme = new ProgrammeFactory('BBC Proms', 'https://proms.jpg/');

      expect(ctrl.programmes).toEqual([programme]);
    });

    it('updates the pages', function () {
      expect(ctrl.pages).toEqual([1, 2, 3, 4]);
    });
  });
});
