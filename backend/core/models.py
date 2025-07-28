from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    games_played = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    def win_rate(self):
        if self.games_played == 0:
            return 0
        return round((self.wins / self.games_played) * 100, 1)
    
    def display_name(self):
        return self.first_name
    
    # later on add display name as fname+lname as a property

