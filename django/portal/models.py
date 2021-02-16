from djongo import models


class Subject(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=64)
    description = models.TextField()

    def __str__(self):
        return self.name

class News(models.Model):
    _id = models.ObjectIdField()
    title = models.CharField(max_length=128)
    content = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return self.title