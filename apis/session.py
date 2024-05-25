class Session:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Session, cls).__new__(cls, *args, **kwargs)
            cls._instance.session = {}
        return cls._instance

    def get(self, key):
        return self.session.get(key, None)

    def __setitem__(self, key, value):
        self.session[key] = value

    def clear(self):
        self.session = {}

request = Session()